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
import { FarmFixture } from '../../../fixtures/farm.fixture';
import { HarvestFixture } from '../../../fixtures/harvest.fixture';
import { Farm } from '@/modules/farms/domain/entities/farm.entity';
import { IFarmRepository } from '@/modules/farms/domain/repositories/farm.repository';
import { ICropRepository } from '@/modules/farms/domain/repositories/crop.repository';
import { FarmCropService } from '@/modules/farms/application/services/farm-crop.service';
import { IHarvestRepository } from '@/modules/farms/domain/repositories/harvest.repository';

describe('FarmCropService', () => {
  let service: FarmCropService;
  let farmRepository: jest.Mocked<IFarmRepository>;
  let cropRepository: jest.Mocked<ICropRepository>;
  let harvestRepository: jest.Mocked<IHarvestRepository>;

  const farmId = faker.string.uuid();
  const input = [
    {
      cropId: faker.string.uuid(),
      harvestId: faker.string.uuid(),
      harvestDate: new Date(),
      plantedArea: 10,
    },
  ];

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        FarmCropService,
        {
          provide: FARM_REPOSITORY,
          useValue: {
            findById: jest.fn(),
            assignCropsToFarm: jest.fn(),
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

    service = module.get(FarmCropService);
    farmRepository = module.get(FARM_REPOSITORY);
    cropRepository = module.get(CROP_REPOSITORY);
    harvestRepository = module.get(HARVEST_REPOSITORY);
  });

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
    expect(error.message).toBe(`Farm with ID ${farmId} not found.`);
  });

  it('should throw NotFoundException if crop is not found', async () => {
    const farmModel = FarmFixture.createFarm();
    const harvestModel = HarvestFixture.createHarvest();

    const farmEntity = FarmFixture.entity(farmModel);
    const harvestEntity = FarmFixture.harvestEntity(harvestModel);

    jest.spyOn(farmRepository, 'findById').mockResolvedValue(farmEntity);
    jest.spyOn(cropRepository, 'findById').mockResolvedValue(null);
    jest.spyOn(harvestRepository, 'findById').mockResolvedValue(harvestEntity);

    let error;

    try {
      await service.assignCropsToFarm(farmId, input);
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error).toBeInstanceOf(NotFoundException);
    expect(error.message).toBe(`Crop ${input[0].cropId} not found.`);
  });

  it('should throw NotFoundException if harvest is not found', async () => {
    const farmModel = FarmFixture.createFarmWithCrops();

    const farmEntity = FarmFixture.entity(farmModel);
    const cropEntity = FarmFixture.cropEntity(farmModel.farmCropHarvests[0]);

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
    expect(error.message).toBe(`Harvest ${input[0].harvestId} not found.`);
  });

  it('should throw UnprocessableEntityException if planted area exceeds limit', async () => {
    const farmModel = FarmFixture.createFarmWithCrops();
    const harvestModel = HarvestFixture.createHarvest();

    const farmEntity = FarmFixture.entity(farmModel);
    const cropEntity = FarmFixture.cropEntity(farmModel.farmCropHarvests[0]);
    const harvestEntity = FarmFixture.harvestEntity(harvestModel);

    jest.spyOn(farmRepository, 'findById').mockResolvedValue(farmEntity);
    jest.spyOn(cropRepository, 'findById').mockResolvedValue(cropEntity);
    jest.spyOn(harvestRepository, 'findById').mockResolvedValue(harvestEntity);

    let error;

    try {
      await service.assignCropsToFarm('farm-id', [
        { ...input[0], plantedArea: 1000 },
      ]);
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error).toBeInstanceOf(UnprocessableEntityException);
    expect(error.message).toBe(
      `Planted area (1000) exceeds the available agriculture area (${farmEntity.agricultureArea})`
    );
  });

  it('should assign crops and return formatted output', async () => {
    const farmModel = FarmFixture.createFarmWithCrops();
    const harvestModel = HarvestFixture.createHarvest();

    const farmEntity = FarmFixture.entity(farmModel);
    const cropEntity = FarmFixture.cropEntity(farmModel.farmCropHarvests[0]);
    const harvestEntity = FarmFixture.harvestEntity(harvestModel);

    const assignedFarm = Farm.instance({
      ...farmEntity,
      crops: [...farmEntity.crops, cropEntity],
    });

    jest.spyOn(farmRepository, 'findById').mockResolvedValue(farmEntity);
    jest.spyOn(cropRepository, 'findById').mockResolvedValue(cropEntity);
    jest.spyOn(harvestRepository, 'findById').mockResolvedValue(harvestEntity);
    jest
      .spyOn(farmRepository, 'assignCropsToFarm')
      .mockResolvedValue(assignedFarm);

    const result = await service.assignCropsToFarm(farmId, input);

    expect(result).toMatchObject({
      id: assignedFarm.id,
      name: assignedFarm.name,
      totalArea: assignedFarm.totalArea.toString(),
      agricultureArea: assignedFarm.agricultureArea.toString(),
      vegetationArea: assignedFarm.vegetationArea.toString(),
      state: assignedFarm.state,
      city: assignedFarm.city,
      ruralProducerId: assignedFarm.ruralProducerId,
      createdAt: assignedFarm.createdAt,
      crops: [
        {
          createdAt: cropEntity.createdAt,
          harvestDate: cropEntity.harvestDate,
          id: cropEntity.id,
          plantedArea: cropEntity.plantedArea.toString(),
        },
      ],
    });
  });
});
