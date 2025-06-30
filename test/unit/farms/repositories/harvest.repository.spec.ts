import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { HarvestRepository } from '@/modules/farms/infrastructure/repositories/harvest.repository';
import { HarvestModel } from '@/database/models/harvest.model';
import { Harvest } from '@/modules/farms/domain/entities/harvest.entity';
import { HarvestFixture } from '../../../fixtures/harvest.fixture';

describe('HarvestRepository', () => {
  let harvestRepository: HarvestRepository;
  let repository: jest.Mocked<Repository<HarvestModel>>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        HarvestRepository,
        {
          provide: getRepositoryToken(HarvestModel),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    harvestRepository = module.get(HarvestRepository);
    repository = module.get(getRepositoryToken(HarvestModel));
  });

  describe('#findById', () => {
    it('should return a harvest entity when found', async () => {
      const harvestModel = HarvestFixture.createHarvest();

      repository.findOne.mockResolvedValue(harvestModel);

      const result = await harvestRepository.findById(harvestModel.id);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: harvestModel.id, deletedAt: null },
      });

      expect(result).toEqual(
        Harvest.instance({
          id: harvestModel.id,
          year: harvestModel.year,
          createdAt: harvestModel.createdAt,
        })
      );
    });

    it('should return null when harvest is not found', async () => {
      repository.findOne.mockResolvedValue(null);

      const result = await harvestRepository.findById('non-existent-id');

      expect(result).toBeNull();
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 'non-existent-id', deletedAt: null },
      });
    });
  });
});
