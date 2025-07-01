import {
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Test } from '@nestjs/testing';

import { Farm } from '@/farms/domain/entities/farm.entity';
import { FarmFixture } from '../../../fixtures/farm.fixture';
import { FarmService } from '@/farms/application/services/farm.service';
import {
  FARM_REPOSITORY,
  RURAL_PRODUCER_REPOSITORY,
} from '@/shared/repositories/tokens';
import { IFarmRepository } from '@/farms/domain/repositories/farm.repository';
import { IRuralProducerRepository } from '@/rural-producers/domain/repositories/rural-producer.repository';

jest.mock('uuid', () => ({
  v4: jest.fn(),
}));

describe('FarmService', () => {
  let farmService: FarmService;
  let farmRepository: IFarmRepository;
  let ruralProducerRepository: IRuralProducerRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        FarmService,
        {
          provide: FARM_REPOSITORY,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findById: jest.fn(),
            update: jest.fn(),
            softDelete: jest.fn(),
          },
        },
        {
          provide: RURAL_PRODUCER_REPOSITORY,
          useValue: {
            checkExistsById: jest.fn(),
          },
        },
      ],
    }).compile();

    farmService = module.get(FarmService);
    farmRepository = module.get(FARM_REPOSITORY);
    ruralProducerRepository = module.get(RURAL_PRODUCER_REPOSITORY);
  });

  describe('#create', () => {
    it('should create a farm successfully', async () => {
      const farmModel = FarmFixture.createFarm();
      const farmEntity = FarmFixture.entity(farmModel);

      const input = {
        name: farmModel.name,
        city: farmModel.city,
        state: farmModel.state,
        totalArea: Number(farmModel.totalArea),
        ruralProducerId: farmModel.ruralProducerId,
        vegetationArea: Number(farmModel.vegetationArea),
        agricultureArea: Number(farmModel.agricultureArea),
      };

      (uuidv4 as jest.Mock).mockReturnValue(farmModel.id);

      jest
        .spyOn(ruralProducerRepository, 'checkExistsById')
        .mockResolvedValue(true);

      jest.spyOn(farmRepository, 'create').mockResolvedValue({
        ...farmEntity,
        createdAt: farmModel.createdAt,
      } as Farm);

      const result = await farmService.create(input);

      expect(result).toEqual({
        id: farmModel.id,
        name: farmModel.name,
        city: farmModel.city,
        state: farmModel.state,
        createdAt: farmModel.createdAt,
        totalArea: farmModel.totalArea.toString(),
        ruralProducerId: farmModel.ruralProducerId,
        vegetationArea: farmModel.vegetationArea.toString(),
        agricultureArea: farmModel.agricultureArea.toString(),
      });
    });

    it('should throw NotFoundException when rural producer does not exist', async () => {
      const farm = FarmFixture.createFarm();
      const input = {
        name: farm.name,
        city: farm.city,
        state: farm.state,
        totalArea: Number(farm.totalArea),
        ruralProducerId: farm.ruralProducerId,
        vegetationArea: Number(farm.vegetationArea),
        agricultureArea: Number(farm.agricultureArea),
      };

      jest
        .spyOn(ruralProducerRepository, 'checkExistsById')
        .mockResolvedValue(false);

      let error;

      try {
        await farmService.create(input);
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.status).toBe(404);
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toBe(
        `Rural producer with ID ${farm.ruralProducerId} not found.`
      );
    });

    it('should throw UnprocessableEntityException when InvalidDocumentException is thrown', async () => {
      const farm = FarmFixture.createFarm();

      const input = {
        ...farm,
        totalArea: 100,
        agricultureArea: 60,
        vegetationArea: 60,
      };

      jest
        .spyOn(ruralProducerRepository, 'checkExistsById')
        .mockResolvedValue(true);

      let error;

      try {
        await farmService.create(input);
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.status).toBe(422);
      expect(error).toBeInstanceOf(UnprocessableEntityException);
      expect(error.message).toBe(
        'Invalid areas: agriculture (60) + vegetation (60) exceeds total area (100)'
      );
      expect(farmRepository.create).not.toHaveBeenCalled();
      expect(ruralProducerRepository.checkExistsById).toHaveBeenCalledWith(
        farm.ruralProducerId
      );
    });
  });

  describe('#list', () => {
    it('should list all farms', async () => {
      const farmModels = FarmFixture.createManyFarmsWithCrops(3);
      const farmEntities = farmModels.map(FarmFixture.entity);
      const input = {
        page: 1,
        limit: 10,
      };

      jest.spyOn(farmRepository, 'findAll').mockResolvedValue(farmEntities);

      const result = await farmService.listPaginated(input);

      expect(result).toHaveLength(3);
      expect(result[0]).toEqual({
        id: farmModels[0].id,
        name: farmModels[0].name,
        city: farmModels[0].city,
        state: farmModels[0].state,
        totalArea: farmModels[0].totalArea.toString(),
        agricultureArea: farmModels[0].agricultureArea.toString(),
        vegetationArea: farmModels[0].vegetationArea.toString(),
        ruralProducerId: farmModels[0].ruralProducerId,
        createdAt: farmModels[0].createdAt,
        crops: farmModels[0].farmCropHarvests.map(farmCropHarvest => ({
          cropId: farmCropHarvest.cropId,
          name: farmCropHarvest.crop.name,
          farmCropHarvestId: farmCropHarvest.id,
          harvestId: farmCropHarvest.harvestId,
          harvestDate: farmCropHarvest.harvestDate,
          harvestYear: farmCropHarvest.harvest.year,
          createdAt: farmCropHarvest.createdAt,
          plantedArea: farmCropHarvest.plantedArea.toString(),
        })),
      });
    });
  });

  describe('#findById', () => {
    it('should find a farm by ID', async () => {
      const farmModel = FarmFixture.createFarmWithCrops();
      const farmEntity = FarmFixture.entity(farmModel);

      jest.spyOn(farmRepository, 'findById').mockResolvedValue(farmEntity);

      const result = await farmService.findById(farmModel.id);

      expect(result).toEqual({
        id: farmModel.id,
        name: farmModel.name,
        city: farmModel.city,
        state: farmModel.state,
        totalArea: farmModel.totalArea.toString(),
        agricultureArea: farmModel.agricultureArea.toString(),
        vegetationArea: farmModel.vegetationArea.toString(),
        ruralProducerId: farmModel.ruralProducerId,
        createdAt: farmModel.createdAt,
        crops: farmModel.farmCropHarvests.map(farmCropHarvest => ({
          cropId: farmCropHarvest.cropId,
          farmCropHarvestId: farmCropHarvest.id,
          harvestId: farmCropHarvest.harvestId,
          name: farmCropHarvest.crop.name,
          harvestDate: farmCropHarvest.harvestDate,
          harvestYear: farmCropHarvest.harvest.year,
          createdAt: farmCropHarvest.createdAt,
          plantedArea: farmCropHarvest.plantedArea.toString(),
        })),
      });
    });

    it('should throw NotFoundException when farm does not exist', async () => {
      const nonExistentId = 'non-existent-id';

      jest.spyOn(farmRepository, 'findById').mockResolvedValue(null);

      let error;

      try {
        await farmService.findById(nonExistentId);
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.status).toBe(404);
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toBe(`Farm with ID ${nonExistentId} not found.`);
    });
  });

  describe('#update', () => {
    it('should update a farm successfully', async () => {
      const farmModel = FarmFixture.createFarm();
      const farmEntity = FarmFixture.entity(farmModel);

      const input = {
        name: 'Updated Farm Name',
        city: 'Updated City',
        state: 'Updated State',
        totalArea: 200,
        ruralProducerId: farmModel.ruralProducerId,
        vegetationArea: 50,
        agricultureArea: 150,
      };

      jest
        .spyOn(ruralProducerRepository, 'checkExistsById')
        .mockResolvedValue(true);

      jest.spyOn(farmRepository, 'findById').mockResolvedValue(farmEntity);

      await farmService.update(farmModel.id, input);

      expect(farmRepository.update).toHaveBeenCalledWith({
        ...farmEntity,
        name: input.name,
        city: input.city,
        state: input.state,
      });
    });

    it('should throw NotFoundException when farm does not exist', async () => {
      const nonExistentId = 'non-existent-id';
      const input = {
        name: 'Updated Farm Name',
        city: 'Updated City',
        state: 'Updated State',
        totalArea: 200,
        ruralProducerId: 'rural-producer-id',
        vegetationArea: 50,
        agricultureArea: 150,
      };

      jest.spyOn(farmRepository, 'findById').mockResolvedValue(null);

      let error;

      try {
        await farmService.update(nonExistentId, input);
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.status).toBe(404);
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toBe(`Farm with ID ${nonExistentId} not found.`);
    });
  });
});
