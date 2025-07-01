import { Test } from '@nestjs/testing';
import { faker } from '@faker-js/faker/.';
import {
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';

import {
  FARM_REPOSITORY,
  CROP_REPOSITORY,
  HARVEST_REPOSITORY,
} from '@/shared/tokens';
import { Farm } from '@/farms/domain/entities/farm.entity';
import { FarmFixture } from '../../../fixtures/farm.fixture';
import { CropFixture } from '../../../fixtures/crop.fixture';
import { HarvestFixture } from '../../../fixtures/harvest.fixture';
import { IFarmRepository } from '@/farms/domain/repositories/farm.repository';
import { ICropRepository } from '@/crops/domain/repositories/crop.repository';
import { IHarvestRepository } from '@/harvests/domain/repositories/harvest.repository';
import { FarmCropHarvestService } from '@/farms/application/services/farm-crop-harvest.service';

describe('FarmCropHarvestService', () => {
  let service: FarmCropHarvestService;
  let farmRepository: jest.Mocked<IFarmRepository>;
  let cropRepository: jest.Mocked<ICropRepository>;
  let harvestRepository: jest.Mocked<IHarvestRepository>;

  const farmId = faker.string.uuid();
  const input = [
    {
      cropId: faker.string.uuid(),
      harvestId: faker.string.uuid(),
      harvestDate: '2023-10-01',
      plantedArea: 10,
    },
  ];

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        FarmCropHarvestService,
        {
          provide: FARM_REPOSITORY,
          useValue: {
            findById: jest.fn(),
            assignCropsToFarm: jest.fn(),
            deleteFarmCropHarvest: jest.fn(),
            findFarmCropHarvestById: jest.fn(),
          },
        },
        {
          provide: CROP_REPOSITORY,
          useValue: {
            findById: jest.fn(),
          },
        },
        {
          provide: HARVEST_REPOSITORY,
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(FarmCropHarvestService);
    farmRepository = module.get(FARM_REPOSITORY);
    cropRepository = module.get(CROP_REPOSITORY);
    harvestRepository = module.get(HARVEST_REPOSITORY);
  });

  describe('#assignCropsToFarm', () => {
    it('should throw NotFoundException if farm is not found', async () => {
      jest.spyOn(farmRepository, 'findById').mockResolvedValue(null);

      let error;
      try {
        await service.assignCropsToFarm(farmId, input);
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toBe(`Farm not found.`);
    });

    it('should throw NotFoundException if crop is not found', async () => {
      const farmModel = FarmFixture.createFarm();
      const harvestModel = HarvestFixture.createHarvest();

      const farmEntity = FarmFixture.entity(farmModel);
      const harvestEntity = HarvestFixture.entity(harvestModel);

      jest.spyOn(farmRepository, 'findById').mockResolvedValue(farmEntity);
      jest.spyOn(cropRepository, 'findById').mockResolvedValue(null);
      jest
        .spyOn(harvestRepository, 'findById')
        .mockResolvedValue(harvestEntity);

      let error;

      try {
        await service.assignCropsToFarm(farmId, input);
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toBe(`Crop not found.`);
    });

    it('should throw NotFoundException if harvest is not found', async () => {
      const farmModel = FarmFixture.createFarmWithCrops();
      const cropModel = CropFixture.createCrop(
        farmModel.farmCropHarvests[0].cropId
      );

      const farmEntity = FarmFixture.entity(farmModel);
      const cropEntity = CropFixture.entity(cropModel);

      jest.spyOn(farmRepository, 'findById').mockResolvedValue(farmEntity);
      jest.spyOn(cropRepository, 'findById').mockResolvedValue(cropEntity);
      jest.spyOn(harvestRepository, 'findById').mockResolvedValue(null);

      let error;
      try {
        await service.assignCropsToFarm(farmId, input);
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toBe(`Harvest not found.`);
    });

    it('should throw UnprocessableEntityException if planted area exceeds limit', async () => {
      const farmModel = FarmFixture.createFarmWithCrops();
      const cropModel = CropFixture.createCrop(
        farmModel.farmCropHarvests[0].cropId
      );
      const harvestModel = HarvestFixture.createHarvest();

      const farmEntity = FarmFixture.entity(farmModel);
      const cropEntity = CropFixture.entity(cropModel);
      const harvestEntity = HarvestFixture.entity(harvestModel);

      jest.spyOn(farmRepository, 'findById').mockResolvedValue(farmEntity);
      jest.spyOn(cropRepository, 'findById').mockResolvedValue(cropEntity);
      jest
        .spyOn(harvestRepository, 'findById')
        .mockResolvedValue(harvestEntity);

      let error;

      try {
        await service.assignCropsToFarm('farm-id', [
          { ...input[0], plantedArea: 2000 },
        ]);
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error).toBeInstanceOf(UnprocessableEntityException);
      expect(error.message).toBe(
        `Planted area (${farmEntity.farmCropHarvests[0].plantedArea.add(2000).toNumber()}) exceeds the available agriculture area (${farmEntity.agricultureArea})`
      );
    });

    it('should assign crops and return formatted output', async () => {
      const farmModel = FarmFixture.createFarmWithCrops();
      const cropModel = CropFixture.createCrop(
        farmModel.farmCropHarvests[0].cropId
      );
      const harvestModel = HarvestFixture.createHarvest();

      const farmEntity = FarmFixture.entity(farmModel);
      const cropEntity = CropFixture.entity(cropModel);
      const harvestEntity = HarvestFixture.entity(harvestModel);

      const assignedFarm = Farm.instance({
        ...farmEntity,
        farmCropHarvests: [...farmEntity.farmCropHarvests],
      });

      jest.spyOn(farmRepository, 'findById').mockResolvedValue(farmEntity);
      jest.spyOn(cropRepository, 'findById').mockResolvedValue(cropEntity);
      jest
        .spyOn(harvestRepository, 'findById')
        .mockResolvedValue(harvestEntity);
      jest
        .spyOn(farmRepository, 'assignCropsToFarm')
        .mockResolvedValue(assignedFarm);

      const result = await service.assignCropsToFarm(farmId, input);

      expect(result).toEqual({
        id: assignedFarm.id,
        name: assignedFarm.name,
        totalArea: assignedFarm.totalArea.toString(),
        agricultureArea: assignedFarm.agricultureArea.toString(),
        vegetationArea: assignedFarm.vegetationArea.toString(),
        state: assignedFarm.state,
        city: assignedFarm.city,
        ruralProducerId: assignedFarm.ruralProducerId,
        createdAt: assignedFarm.createdAt,
        crops: assignedFarm.farmCropHarvests.map(crop => ({
          cropId: crop.cropId,
          name: crop.name,
          harvestId: crop.harvestId,
          harvestYear: crop.harvestYear,
          farmCropHarvestId: crop.farmCropHarvestId,
          plantedArea: crop.plantedArea.toString(),
          harvestDate: crop.harvestDate,
          createdAt: crop.createdAt,
        })),
      });
    });
  });

  describe('#delete', () => {
    it('should throw NotFoundException if farm is not found', async () => {
      jest.spyOn(farmRepository, 'findById').mockResolvedValue(null);

      let error;
      try {
        await service.delete(farmId, faker.string.uuid());
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toBe(`Farm not found.`);
    });

    it('should delete farm crop harvest and return void', async () => {
      const farmModel = FarmFixture.createFarmWithCrops();
      const farmEntity = FarmFixture.entity(farmModel);
      const farmCropHarvestEntity = FarmFixture.farmCropHarvestEntity(
        farmModel.farmCropHarvests[0]
      );

      jest.spyOn(farmRepository, 'findById').mockResolvedValue(farmEntity);
      jest
        .spyOn(farmRepository, 'findFarmCropHarvestById')
        .mockResolvedValue(farmCropHarvestEntity);
      jest
        .spyOn(farmRepository, 'deleteFarmCropHarvest')
        .mockResolvedValue(null);

      await service.delete(
        farmModel.id,
        farmEntity.farmCropHarvests[0].farmCropHarvestId
      );

      expect(farmRepository.deleteFarmCropHarvest).toHaveBeenCalledWith(
        farmEntity.farmCropHarvests[0].farmCropHarvestId
      );
    });

    it('should throw NotFoundException if farm crop harvest is not found', async () => {
      const farmCropHarvestId = faker.string.uuid();
      const farmModel = FarmFixture.createFarmWithCrops();
      const farmEntity = FarmFixture.entity(farmModel);

      jest.spyOn(farmRepository, 'findById').mockResolvedValue(farmEntity);

      let error;
      try {
        await service.delete(farmId, farmCropHarvestId);
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toBe(`Farm crop harvest not found.`);
    });

    it('should throw UnprocessableEntityException if farm crop harvest does not belong to farm', async () => {
      const farmCropHarvestId = faker.string.uuid();
      const farmModel = FarmFixture.createFarmWithCrops();
      const farmEntity = FarmFixture.entity(farmModel);
      const farmHarvestCropEntity = FarmFixture.farmCropHarvestEntity(
        farmModel.farmCropHarvests[0]
      );

      jest.spyOn(farmRepository, 'findById').mockResolvedValue(farmEntity);
      jest
        .spyOn(farmRepository, 'findFarmCropHarvestById')
        .mockResolvedValue(farmHarvestCropEntity);

      let error;
      try {
        await service.delete(farmId, farmCropHarvestId);
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error).toBeInstanceOf(UnprocessableEntityException);
      expect(error.message).toBe(`Farm crop harvest does not belong to farm.`);
    });
  });
});
