import { Repository } from 'typeorm';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { HarvestModel } from '@/database/models/harvest.model';
import { HarvestFixture } from '../../../fixtures/harvest.fixture';
import { HarvestRepository } from '@/modules/harvests/infrastructure/repositories/harvest.repository';

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
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    harvestRepository = module.get(HarvestRepository);
    repository = module.get(getRepositoryToken(HarvestModel));
  });

  describe('#create', () => {
    it('should create and return a harvest', async () => {
      const harvestModel = HarvestFixture.createHarvest();
      const harvestEntity = HarvestFixture.entity(harvestModel);

      jest.spyOn(repository, 'create').mockReturnValue(harvestModel);
      jest.spyOn(repository, 'save').mockResolvedValue(harvestModel);

      const result = await harvestRepository.create(harvestEntity);

      expect(repository.create).toHaveBeenCalledWith({
        id: harvestEntity.id,
        year: harvestEntity.year,
      });
      expect(repository.save).toHaveBeenCalledWith(harvestModel);

      expect(result).toEqual(harvestEntity);
    });
  });

  describe('#findAll', () => {
    it('should return all harvests', async () => {
      const harvestsModel = HarvestFixture.createManyHarvest(2);
      const harvestsEntities = harvestsModel.map(HarvestFixture.entity);

      repository.find.mockResolvedValue(harvestsModel);

      const result = await harvestRepository.findAll();

      expect(repository.find).toHaveBeenCalledWith({
        where: { deletedAt: null },
      });

      expect(result).toHaveLength(2);
      expect(result).toEqual(expect.arrayContaining(harvestsEntities));
    });
  });
});
