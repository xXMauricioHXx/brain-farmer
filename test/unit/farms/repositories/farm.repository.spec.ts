import Decimal from 'decimal.js';
import { v4 as uuidv4 } from 'uuid';
import { Repository } from 'typeorm';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { FarmModel } from '@/database/models/farm.model';
import { Farm } from '@/farms/domain/entities/farm.entity';
import { FarmFixture } from '../../../fixtures/farm.fixture';
import { CropFixture } from '../../../fixtures/crop.fixture';
import { HarvestFixture } from '../../../fixtures/harvest.fixture';
import { FarmCropHarvestModel } from '@/database/models/farm-crop-harvest.model';
import { FarmCropHarvest } from '@/farms/domain/entities/farm-crop-harvest.entity';
import { FarmCropHarvestFixture } from '../../../fixtures/farm-crop-harvest.fixture';
import { FarmRepository } from '@/farms/infrastructure/repositories/farm.repository';

jest.mock('uuid', () => ({
  v4: jest.fn(),
}));

describe('FarmRepository', () => {
  let farmRepository: FarmRepository;
  let repository: jest.Mocked<Repository<FarmModel>>;
  let farmCropHarvestRepository: jest.Mocked<Repository<FarmCropHarvestModel>>;
  let entityManager: jest.Mocked<Repository<FarmCropHarvestModel>>;

  beforeEach(async () => {
    entityManager = {
      transaction: jest.fn(),
      softDelete: jest.fn(),
    } as unknown as jest.Mocked<Repository<FarmCropHarvestModel>>;

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
            update: jest.fn(),
            softDelete: jest.fn(),
            findAndCount: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(FarmCropHarvestModel),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            manager: {
              transaction: jest
                .fn()
                .mockImplementation(cb => cb(entityManager)),
            },
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
        id: farmEntity.id,
        name: farmEntity.name,
        city: farmEntity.city,
        state: farmEntity.state,
        ruralProducerId: farmEntity.ruralProducerId,
        totalArea: farmEntity.totalArea.toString(),
        vegetationArea: farmEntity.vegetationArea.toString(),
        agricultureArea: farmEntity.agricultureArea.toString(),
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
        relations: [
          'farmCropHarvests',
          'farmCropHarvests.crop',
          'farmCropHarvests.harvest',
        ],
      });

      expect(result).toHaveLength(2);
      expect(result).toEqual(farmEntities);
    });
  });

  describe('#assignCropsToFarm', () => {
    it('should associate crops to a farm', async () => {
      const farmModel = FarmFixture.createFarmWithCrops();
      const cropModel = CropFixture.createCrop(
        farmModel.farmCropHarvests[0].cropId
      );
      const harvestModel = HarvestFixture.createHarvest(
        farmModel.farmCropHarvests[0].harvestId,
        farmModel.farmCropHarvests[0].harvest.year
      );

      const farmEntity = FarmFixture.entity(farmModel);
      const harvestEntity = HarvestFixture.entity(harvestModel);
      const cropEntity = CropFixture.entity(cropModel);

      const fakeUUID = 'generated-uuid';
      (uuidv4 as jest.Mock).mockReturnValue(fakeUUID);

      const farmCropHarvestModel = FarmCropHarvestFixture.createFarmCropHarvest(
        cropEntity.id,
        farmEntity.id,
        harvestEntity.id
      );

      const farmCropHarvestEntity =
        FarmCropHarvestFixture.entity(farmCropHarvestModel);

      jest
        .spyOn(farmCropHarvestRepository, 'create')
        .mockReturnValue(farmCropHarvestModel);

      const result = await farmRepository.assignCropsToFarm(farmEntity, [
        farmCropHarvestEntity,
      ]);

      expect(farmCropHarvestRepository.create).toHaveBeenCalledWith({
        id: fakeUUID,
        farmId: farmEntity.id,
        cropId: farmCropHarvestEntity.cropId,
        harvestId: farmCropHarvestEntity.harvestId,
        harvestDate: farmCropHarvestEntity.harvestDate,
        plantedArea: farmCropHarvestEntity.plantedArea.toString(),
      });

      expect(farmCropHarvestRepository.save).toHaveBeenCalledWith([
        farmCropHarvestModel,
      ]);
      expect(result).toEqual(
        Farm.instance({
          ...farmEntity,
          farmCropHarvests: [
            ...farmEntity.farmCropHarvests,
            farmCropHarvestEntity,
          ],
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
        relations: [
          'farmCropHarvests',
          'farmCropHarvests.crop',
          'farmCropHarvests.harvest',
        ],
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
          farmCropHarvests: farmModel.farmCropHarvests.map(farmCropHarvest => {
            return FarmCropHarvest.instance({
              farmId: farmCropHarvest.farmId,
              cropId: farmCropHarvest.cropId,
              name: farmCropHarvest.crop.name,
              harvestId: farmCropHarvest.harvestId,
              createdAt: farmCropHarvest.createdAt,
              farmCropHarvestId: farmCropHarvest.id,
              harvestDate: farmCropHarvest.harvestDate,
              harvestYear: farmCropHarvest.harvest.year,
              plantedArea: new Decimal(farmCropHarvest.plantedArea),
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

  describe('#update', () => {
    it('should update a farm', async () => {
      const farmModel = FarmFixture.createFarm();
      const farmEntity = FarmFixture.entity(farmModel);

      await farmRepository.update(farmEntity);

      expect(repository.update).toHaveBeenCalledWith(farmEntity.id, {
        name: farmEntity.name,
        city: farmEntity.city,
        state: farmEntity.state,
        ruralProducerId: farmEntity.ruralProducerId,
      });
    });
  });

  describe('#softDelete', () => {
    it('should soft delete a farm and its associated crops', async () => {
      const farmId = 'test-farm-id';

      await farmRepository.softDelete(farmId);

      expect(
        farmCropHarvestRepository.manager.transaction
      ).toHaveBeenCalledWith(expect.any(Function));

      expect(entityManager.softDelete).toHaveBeenNthCalledWith(
        1,
        FarmCropHarvestModel,
        { farmId }
      );

      expect(entityManager.softDelete).toHaveBeenNthCalledWith(
        2,
        FarmModel,
        farmId
      );
    });
  });

  describe('#findPaginated', () => {
    it('should return paginated farms', async () => {
      const farms = FarmFixture.createManyFarms(3);
      const farmEntities = farms.map(FarmFixture.entity);

      jest.spyOn(repository, 'findAndCount').mockResolvedValue([farms, 3]);

      const [result, total] = await farmRepository.findPaginated({
        page: 1,
        limit: 10,
      });

      expect(repository.findAndCount).toHaveBeenCalledWith({
        where: { deletedAt: null },
        order: { createdAt: 'DESC' },
        skip: 0,
        take: 10,
        relations: [
          'farmCropHarvests',
          'farmCropHarvests.crop',
          'farmCropHarvests.harvest',
        ],
      });

      expect(result).toEqual(farmEntities);
      expect(total).toBe(3);
    });
  });
});
