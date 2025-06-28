import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RuralProducerRepository } from '@/modules/rural-producers/infrastructure/repositories/rural-producer.repository';
import { RuralProducerModel } from '@/database/models/rural-producer.model';
import { RuralProducerFixture } from '../../../fixtures/rutal-producer.fixture';

describe('RuralProducerRepository', () => {
  let ruralProducerRepository: RuralProducerRepository;
  let repository: jest.Mocked<Repository<RuralProducerModel>>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        RuralProducerRepository,
        {
          provide: getRepositoryToken(RuralProducerModel),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
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

  describe('findAll', () => {
    it('should return all producers that are not soft deleted', async () => {
      const ruralProducers = RuralProducerFixture.createManyRuralProducers(2);

      jest.spyOn(repository, 'find').mockResolvedValue(ruralProducers);

      const result = await ruralProducerRepository.findAll();

      expect(repository.find).toHaveBeenCalledWith({
        where: { deletedAt: null },
      });
      expect(result).toHaveLength(2);
      expect(result).toEqual(
        ruralProducers.map(producer => RuralProducerFixture.entity(producer))
      );
    });
  });

  describe('findByDocument', () => {
    it('should return a producer when found by document', async () => {
      const ruralProducer = RuralProducerFixture.createRuralProducer();

      jest.spyOn(repository, 'findOne').mockResolvedValue(ruralProducer);

      const result = await ruralProducerRepository.findByDocument(
        ruralProducer.document
      );

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { document: ruralProducer.document },
      });
      expect(result).toEqual(RuralProducerFixture.entity(ruralProducer));
    });

    it('should return null when not found', async () => {
      repository.findOne.mockResolvedValue(null);

      const result =
        await ruralProducerRepository.findByDocument('00000000000');

      expect(result).toBeNull();
    });
  });
});
