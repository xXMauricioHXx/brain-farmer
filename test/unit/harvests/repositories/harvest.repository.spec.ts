import { Repository } from 'typeorm';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { HarvestModel } from '@/database/models/harvest.model';
import { HarvestFixture } from '../../../fixtures/harvest.fixture';
import { HarvestRepository } from '@/harvests/infrastructure/repositories/harvest.repository';
import { FarmCropHarvestModel } from '@/database/models/farm-crop-harvest.model';

describe('HarvestRepository', () => {
  let harvestRepository: HarvestRepository;
  let repository: jest.Mocked<Repository<HarvestModel>>;
  let entityManager: jest.Mocked<Repository<FarmCropHarvestModel>>;

  beforeEach(async () => {
    entityManager = {
      transaction: jest.fn(),
      softDelete: jest.fn(),
    } as unknown as jest.Mocked<Repository<FarmCropHarvestModel>>;

    const module = await Test.createTestingModule({
      providers: [
        HarvestRepository,
        {
          provide: getRepositoryToken(HarvestModel),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            softDelete: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(FarmCropHarvestModel),
          useValue: {
            manager: {
              transaction: jest
                .fn()
                .mockImplementation(cb => cb(entityManager)),
            },
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

  describe('#findById', () => {
    it('should return a harvest by id', async () => {
      const harvestModel = HarvestFixture.createHarvest();
      const harvestEntity = HarvestFixture.entity(harvestModel);

      repository.findOne.mockResolvedValue(harvestModel);

      const result = await harvestRepository.findById(harvestEntity.id);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: harvestEntity.id, deletedAt: null },
      });

      expect(result).toEqual(harvestEntity);
    });

    it('should return null if harvest not found', async () => {
      repository.findOne.mockResolvedValue(null);

      const result = await harvestRepository.findById('non-existent-id');

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 'non-existent-id', deletedAt: null },
      });

      expect(result).toBeNull();
    });
  });

  describe('#update', () => {
    it('should update a harvest', async () => {
      const harvestModel = HarvestFixture.createHarvest();
      const harvestEntity = HarvestFixture.entity(harvestModel);

      jest.spyOn(repository, 'update').mockResolvedValue(undefined);

      await harvestRepository.update(harvestEntity);

      expect(repository.update).toHaveBeenCalledWith(harvestEntity.id, {
        year: harvestEntity.year,
        updatedAt: expect.any(Date),
      });
    });
  });

  describe('#softDelete', () => {
    it('should soft delete a harvest and related farm crop harvests', async () => {
      const harvestId = 'test-harvest-id';

      jest.spyOn(entityManager, 'softDelete').mockResolvedValue(undefined);

      await harvestRepository.softDelete(harvestId);

      expect(entityManager.softDelete).toHaveBeenNthCalledWith(
        1,
        FarmCropHarvestModel,
        { harvestId }
      );
      expect(entityManager.softDelete).toHaveBeenNthCalledWith(
        2,
        HarvestModel,
        harvestId
      );
    });
  });
});
