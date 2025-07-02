import { Test } from '@nestjs/testing';
import { v4 as uuidv4 } from 'uuid';

import { HARVEST_REPOSITORY } from '@/shared/repositories/tokens';
import { HarvestFixture } from '../../../fixtures/harvest.fixture';
import { HarvestService } from '@/harvests/application/services/harvest.service';
import { IHarvestRepository } from '@/harvests/domain/repositories/harvest.repository';

jest.mock('uuid', () => ({
  v4: jest.fn(),
}));

describe('HarvestService', () => {
  let harvestService: HarvestService;
  let harvestRepository: jest.Mocked<IHarvestRepository>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        HarvestService,
        {
          provide: HARVEST_REPOSITORY,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findById: jest.fn(),
            update: jest.fn(),
            softDelete: jest.fn(),
          },
        },
      ],
    }).compile();

    harvestService = module.get(HarvestService);
    harvestRepository = module.get(HARVEST_REPOSITORY);
  });

  describe('#create', () => {
    it('should create a new harvest', async () => {
      const harvestModel = HarvestFixture.createHarvest();
      const harvestEntity = HarvestFixture.entity(harvestModel);
      const input = {
        year: harvestModel.year,
      };

      (uuidv4 as jest.Mock).mockReturnValue(harvestModel.id);
      jest.spyOn(harvestRepository, 'create').mockResolvedValue(harvestEntity);

      const result = await harvestService.create(input);

      expect(uuidv4).toHaveBeenCalled();
      expect(harvestRepository.create).toHaveBeenCalledWith({
        ...harvestEntity,
        createdAt: undefined,
      });
      expect(result).toEqual(harvestEntity);
    });
  });

  describe('#list', () => {
    it('should return all harvests', async () => {
      const harvestsModel = HarvestFixture.createManyHarvest(3);
      const harvestEntities = harvestsModel.map(harvest =>
        HarvestFixture.entity(harvest)
      );

      jest
        .spyOn(harvestRepository, 'findAll')
        .mockResolvedValue(harvestEntities);

      const result = await harvestService.list();

      expect(harvestRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual(harvestEntities);
    });
  });

  describe('#findById', () => {
    it('should return a harvest by id', async () => {
      const harvestModel = HarvestFixture.createHarvest();
      const harvestEntity = HarvestFixture.entity(harvestModel);

      jest
        .spyOn(harvestRepository, 'findById')
        .mockResolvedValue(harvestEntity);

      const result = await harvestService.findById(harvestModel.id);

      expect(harvestRepository.findById).toHaveBeenCalledWith(harvestModel.id);
      expect(result).toEqual(harvestEntity);
    });

    it('should throw NotFoundException if harvest does not exist', async () => {
      const harvestId = uuidv4();
      jest.spyOn(harvestRepository, 'findById').mockResolvedValue(null);

      await expect(harvestService.findById(harvestId)).rejects.toThrowError(
        `Harvest not found`
      );
    });
  });

  describe('#update', () => {
    it('should update an existing harvest', async () => {
      const harvestModel = HarvestFixture.createHarvest();
      const harvestEntity = HarvestFixture.entity(harvestModel);
      const input = {
        year: 2024,
      };

      jest
        .spyOn(harvestRepository, 'findById')
        .mockResolvedValue(harvestEntity);
      jest.spyOn(harvestRepository, 'update').mockResolvedValue();

      await harvestService.update(harvestModel.id, input);

      expect(harvestRepository.findById).toHaveBeenCalledWith(harvestModel.id);
      expect(harvestRepository.update).toHaveBeenCalledWith({
        ...harvestEntity,
        year: input.year,
      });
    });
  });

  describe('#delete', () => {
    it('should soft delete a harvest', async () => {
      const harvestModel = HarvestFixture.createHarvest();
      const harvestEntity = HarvestFixture.entity(harvestModel);

      jest
        .spyOn(harvestRepository, 'findById')
        .mockResolvedValue(harvestEntity);
      jest.spyOn(harvestRepository, 'softDelete').mockResolvedValue();

      await harvestService.delete(harvestModel.id);

      expect(harvestRepository.findById).toHaveBeenCalledWith(harvestModel.id);
      expect(harvestRepository.softDelete).toHaveBeenCalledWith(
        harvestModel.id
      );
    });

    it('should throw NotFoundException if harvest does not exist', async () => {
      const harvestId = uuidv4();
      jest.spyOn(harvestRepository, 'findById').mockResolvedValue(null);

      await expect(harvestService.delete(harvestId)).rejects.toThrowError(
        `Harvest not found`
      );
    });
  });
});
