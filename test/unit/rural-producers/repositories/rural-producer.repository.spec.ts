import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { RuralProducerModel } from '@/database/models/rural-producer.model';
import { RuralProducerFixture } from '../../../fixtures/rural-producer.fixture';
import { FarmCropHarvestModel } from '@/database/models/farm-crop-harvest.model';
import { RuralProducerRepository } from '@/rural-producers/infrastructure/repositories/rural-producer.repository';
import { FarmModel } from '@/database/models/farm.model';

describe('RuralProducerRepository', () => {
  let ruralProducerRepository: RuralProducerRepository;
  let repository: jest.Mocked<Repository<RuralProducerModel>>;
  let entityManager: jest.Mocked<Repository<FarmCropHarvestModel>>;

  beforeEach(async () => {
    entityManager = {
      transaction: jest.fn(),
      softDelete: jest.fn(),
      find: jest.fn(),
    } as unknown as jest.Mocked<Repository<FarmCropHarvestModel>>;

    const module = await Test.createTestingModule({
      providers: [
        RuralProducerRepository,
        {
          provide: getRepositoryToken(RuralProducerModel),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            exists: jest.fn(),
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

    ruralProducerRepository = module.get(RuralProducerRepository);
    repository = module.get(getRepositoryToken(RuralProducerModel));
  });

  describe('#create', () => {
    it('should create and return a rural producer', async () => {
      const ruralProducer = RuralProducerFixture.createRuralProducer();
      const ruralProducerEntity = RuralProducerFixture.entity(ruralProducer);

      jest.spyOn(repository, 'create').mockReturnValue(ruralProducer);
      jest.spyOn(repository, 'save').mockResolvedValue(ruralProducer);

      const result = await ruralProducerRepository.create(ruralProducerEntity);

      expect(repository.create).toHaveBeenCalledWith({
        id: ruralProducerEntity.id,
        name: ruralProducerEntity.name,
        document: ruralProducerEntity.document.getValue(),
      });

      expect(result).toEqual(ruralProducerEntity);
    });
  });

  describe('#findAll', () => {
    it('should return all producers that are not soft deleted', async () => {
      const ruralProducers = RuralProducerFixture.createManyRuralProducers(2);

      jest.spyOn(repository, 'find').mockResolvedValue(ruralProducers);

      const result = await ruralProducerRepository.findAll();

      expect(repository.find).toHaveBeenCalledWith({
        where: { deletedAt: null },
        order: { createdAt: 'DESC' },
      });
      expect(result).toHaveLength(2);
      expect(result).toEqual(
        ruralProducers.map(producer => RuralProducerFixture.entity(producer))
      );
    });
  });

  describe('#checkExistsByDocument', () => {
    it('should return a true when found by document', async () => {
      const ruralProducer = RuralProducerFixture.createRuralProducer();

      jest.spyOn(repository, 'exists').mockResolvedValue(true);

      const result = await ruralProducerRepository.checkExistsByDocument(
        ruralProducer.document
      );

      expect(repository.exists).toHaveBeenCalledWith({
        where: { document: ruralProducer.document, deletedAt: null },
      });
      expect(result).toEqual(true);
    });

    it('should return false when not found', async () => {
      const document = '00000000000';
      repository.exists.mockResolvedValue(false);

      const result =
        await ruralProducerRepository.checkExistsByDocument(document);

      expect(result).toEqual(false);
      expect(repository.exists).toHaveBeenCalledWith({
        where: { document, deletedAt: null },
      });
    });
  });

  describe('#checkExistsById', () => {
    it('should return true when rural producer exists by id', async () => {
      const ruralProducer = RuralProducerFixture.createRuralProducer();

      jest.spyOn(repository, 'exists').mockResolvedValue(true);

      const result = await ruralProducerRepository.checkExistsById(
        ruralProducer.id
      );

      expect(repository.exists).toHaveBeenCalledWith({
        where: { id: ruralProducer.id, deletedAt: null },
      });
      expect(result).toEqual(true);
    });

    it('should return false when rural producer does not exist by id', async () => {
      const id = '00000000-0000-0000-0000-000000000000';
      repository.exists.mockResolvedValue(false);

      const result = await ruralProducerRepository.checkExistsById(id);

      expect(result).toEqual(false);
      expect(repository.exists).toHaveBeenCalledWith({
        where: { id, deletedAt: null },
      });
    });
  });

  describe('#findById', () => {
    it('should return a rural producer by id', async () => {
      const ruralProducer = RuralProducerFixture.createRuralProducer();
      const ruralProducerEntity = RuralProducerFixture.entity(ruralProducer);

      jest.spyOn(repository, 'findOne').mockResolvedValue(ruralProducer);

      const result = await ruralProducerRepository.findById(ruralProducer.id);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: ruralProducer.id, deletedAt: null },
      });
      expect(result).toEqual(ruralProducerEntity);
    });

    it('should return null if no rural producer is found', async () => {
      const id = '00000000-0000-0000-0000-000000000000';
      repository.findOne.mockResolvedValue(null);

      const result = await ruralProducerRepository.findById(id);

      expect(result).toBeNull();
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id, deletedAt: null },
      });
    });
  });

  describe('#update', () => {
    it('should update and return a rural producer', async () => {
      const ruralProducer = RuralProducerFixture.createRuralProducer();
      const ruralProducerEntity = RuralProducerFixture.entity(ruralProducer);

      jest.spyOn(repository, 'findOne').mockResolvedValue(ruralProducer);

      const result = await ruralProducerRepository.update(ruralProducerEntity);

      expect(repository.update).toHaveBeenCalledWith(ruralProducer.id, {
        name: ruralProducerEntity.name,
      });

      expect(result).toEqual(ruralProducerEntity);
    });
  });

  describe('#softDelete', () => {
    it('should soft delete a rural producer and its farms', async () => {
      const ruralProducer = RuralProducerFixture.createRuralProducer();
      jest.spyOn(entityManager, 'find').mockResolvedValue([]);

      await ruralProducerRepository.softDelete(ruralProducer.id);

      expect(entityManager.find).toHaveBeenCalledWith(FarmModel, {
        where: { ruralProducerId: ruralProducer.id, deletedAt: null },
      });
      expect(entityManager.softDelete).toHaveBeenCalledWith(
        RuralProducerModel,
        { id: ruralProducer.id }
      );
    });
  });
});
