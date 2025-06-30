import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Decimal from 'decimal.js';
import { v4 as uuidv4 } from 'uuid';

import { FarmRepository } from '@/modules/farms/infrastructure/repositories/farm.repository';
import { FarmModel } from '@/database/models/farm.model';
import { FarmCropHarvestModel } from '@/database/models/farm-crop-harvest.model';
import { FarmFixture } from '../../../fixtures/farm.fixture';
import { Farm } from '@/modules/farms/domain/entities/farm.entity';
import { Crop } from '@/modules/farms/domain/entities/crop.entity';
import { Harvest } from '@/modules/farms/domain/entities/harvest.entity';
import { FarmCropHarvestFixture } from '../../../fixtures/farm-crop-harvest.fixture';

jest.mock('uuid', () => ({
  v4: jest.fn(),
}));

describe('FarmRepository', () => {
  let farmRepository: FarmRepository;
  let repository: jest.Mocked<Repository<FarmModel>>;
  let farmCropHarvestRepository: jest.Mocked<Repository<FarmCropHarvestModel>>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        FarmRepository,
        {
          provide: getRepositoryToken(FarmModel),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(FarmCropHarvestModel),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    farmRepository = module.get(FarmRepository);
    repository = module.get(getRepositoryToken(FarmModel));
    farmCropHarvestRepository = module.get(
      getRepositoryToken(FarmCropHarvestModel)
    );
  });

  describe('#create', () => {
    it('should create and return a farm', async () => {
      const farmModel = FarmFixture.createFarm();
      const farmEntity = FarmFixture.entity(farmModel);

      repository.create.mockReturnValue(farmModel);
      repository.save.mockResolvedValue(farmModel);

      const result = await farmRepository.create(farmEntity);

      expect(repository.create).toHaveBeenCalledWith({
        ...farmEntity,
        agricultureArea: farmEntity.agricultureArea.toString(),
        totalArea: farmEntity.totalArea.toString(),
        vegetationArea: farmEntity.vegetationArea.toString(),
      });

      expect(result).toEqual(farmEntity);
    });
  });

  describe('#findAll', () => {
    it('should return all farms in descending order', async () => {
      const farmModels = FarmFixture.createManyFarms(2);
      const farmEntities = farmModels.map(FarmFixture.entity);

      jest.spyOn(repository, 'find').mockResolvedValue(farmModels);

      const result = await farmRepository.findAll();

      expect(repository.find).toHaveBeenCalledWith({
        where: { deletedAt: null },
        order: { createdAt: 'DESC' },
      });

      expect(result).toHaveLength(2);
      expect(result).toEqual(farmEntities);
    });
  });

  describe('#assignCropsToFarm', () => {
    it('should associate crops to a farm', async () => {
      const farmModel = FarmFixture.createFarmWithCrops();
      const farmEntity = FarmFixture.entity(farmModel);

      const crop = FarmFixture.cropEntity(farmModel.farmCropHarvests[0]);

      const fakeUUID = 'generated-uuid';
      (uuidv4 as jest.Mock).mockReturnValue(fakeUUID);

      const farmCropHarvestModel = FarmCropHarvestFixture.createFarmCropHarvest(
        crop.id,
        farmEntity.id,
        crop.harvest.id
      );

      jest
        .spyOn(farmCropHarvestRepository, 'create')
        .mockReturnValue(farmCropHarvestModel);

      const result = await farmRepository.assignCropsToFarm(farmEntity, [crop]);

      expect(farmCropHarvestRepository.create).toHaveBeenCalledWith({
        id: fakeUUID,
        farmId: farmEntity.id,
        cropId: crop.id,
        harvestId: crop.harvest.id,
        harvestDate: crop.harvestDate,
        plantedArea: crop.plantedArea.toString(),
      });

      expect(farmCropHarvestRepository.save).toHaveBeenCalledWith([
        farmCropHarvestModel,
      ]);
      expect(result).toEqual(
        Farm.instance({
          ...farmEntity,
          crops: [...farmEntity.crops, crop],
        })
      );
    });
  });

  describe('#findById', () => {
    it('should return a farm with crops and harvests', async () => {
      const farmModel = FarmFixture.createFarmWithCrops();

      jest.spyOn(repository, 'findOne').mockResolvedValue(farmModel);

      const result = await farmRepository.findById(farmModel.id);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: farmModel.id, deletedAt: null },
        relations: ['farmCropHarvests', 'farmCropHarvests.harvest'],
        order: { createdAt: 'DESC' },
      });

      expect(result).toEqual(
        Farm.instance({
          id: farmModel.id,
          city: farmModel.city,
          name: farmModel.name,
          state: farmModel.state,
          createdAt: farmModel.createdAt,
          ruralProducerId: farmModel.ruralProducerId,
          totalArea: new Decimal(farmModel.totalArea),
          vegetationArea: new Decimal(farmModel.vegetationArea),
          agricultureArea: new Decimal(farmModel.agricultureArea),
          crops: farmModel.farmCropHarvests.map(farmCropHarvest => {
            return Crop.instance({
              id: farmCropHarvest.cropId,
              harvestDate: farmCropHarvest.harvestDate,
              plantedArea: new Decimal(farmCropHarvest.plantedArea),
              harvest: Harvest.instance({
                id: farmCropHarvest.harvest.id,
                year: farmCropHarvest.harvest.year,
                createdAt: farmCropHarvest.harvest.createdAt,
              }),
              createdAt: farmCropHarvest.createdAt,
            });
          }),
        })
      );
    });

    it('should return null when farm is not found', async () => {
      repository.findOne.mockResolvedValue(null);

      const result = await farmRepository.findById('non-existent-id');

      expect(result).toBeNull();
    });
  });
});
