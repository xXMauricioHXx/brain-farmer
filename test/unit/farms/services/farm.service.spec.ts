import {
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import Decimal from 'decimal.js';
import { v4 as uuidv4 } from 'uuid';
import { Test } from '@nestjs/testing';

import { FarmFixture } from '../../../fixtures/farm.fixture';
import { Farm } from '@/modules/farms/domain/entities/farm.entity';
import { FARM_REPOSITORY, RURAL_PRODUCER_REPOSITORY } from '@/shared/tokens';
import { FarmService } from '@/modules/farms/application/services/farm.service';
import { IFarmRepository } from '@/modules/farms/domain/repositories/farm.repository';
import { IRuralProducerRepository } from '@/modules/rural-producers/domain/repositories/rural-producer.repository';

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
});
