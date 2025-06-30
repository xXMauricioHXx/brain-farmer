import { v4 as uuidv4 } from 'uuid';
import { Test } from '@nestjs/testing';
import { RuralProducerService } from '@/modules/rural-producers/application/services/rural-producer.service';
import { IRuralProducerRepository } from '@/modules/rural-producers/domain/repositories/rural-producer.repository';
import { RuralProducerFixture } from '../../../fixtures/rural-producer.fixture';
import { RuralProducer } from '@/modules/rural-producers/domain/entities/rural-producer.entity';
import { BadRequestException, ConflictException } from '@nestjs/common';
import { RURAL_PRODUCER_REPOSITORY } from '@/shared/tokens';

jest.mock('uuid', () => ({
  v4: jest.fn(),
}));

describe('RuralProducerService', () => {
  let ruralProducerService: RuralProducerService;
  let ruralProducerRepository: IRuralProducerRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        RuralProducerService,
        {
          provide: RURAL_PRODUCER_REPOSITORY,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            checkExistsByDocument: jest.fn(),
          },
        },
      ],
    }).compile();

    ruralProducerService =
      module.get<RuralProducerService>(RuralProducerService);
    ruralProducerRepository = module.get<IRuralProducerRepository>(
      RURAL_PRODUCER_REPOSITORY
    );
  });

  describe('#create', () => {
    it('should create a rural producer', async () => {
      const ruralProducer = RuralProducerFixture.createRuralProducer();
      (uuidv4 as jest.Mock).mockReturnValue(ruralProducer.id);

      const ruralProducerEntity = RuralProducerFixture.entity({
        document: ruralProducer.document,
        id: ruralProducer.id,
        name: ruralProducer.name,
      });

      const data = {
        name: ruralProducer.name,
        document: ruralProducer.document,
      };

      jest
        .spyOn(ruralProducerRepository, 'checkExistsByDocument')
        .mockResolvedValue(false);

      jest.spyOn(ruralProducerRepository, 'create').mockResolvedValue({
        ...ruralProducerEntity,
        createdAt: ruralProducer.createdAt,
      } as RuralProducer);

      const createdProducer = await ruralProducerService.create(data);

      expect(createdProducer).toEqual({
        id: ruralProducer.id,
        name: ruralProducer.name,
        document: ruralProducer.document,
        createdAt: ruralProducer.createdAt,
      });
      expect(
        ruralProducerRepository.checkExistsByDocument
      ).toHaveBeenCalledWith(ruralProducer.document);
      expect(ruralProducerRepository.create).toHaveBeenCalledWith(
        ruralProducerEntity
      );
    });

    it('should throw ConflictException if rural producer with document already exists', async () => {
      const ruralProducer = RuralProducerFixture.createRuralProducer();

      jest
        .spyOn(ruralProducerRepository, 'checkExistsByDocument')
        .mockResolvedValue(true);

      const data = {
        name: ruralProducer.name,
        document: ruralProducer.document,
      };

      let error;
      try {
        await ruralProducerService.create(data);
      } catch (e) {
        error = e;
      }
      expect(error).toBeDefined();
      expect(error.message).toBe('Unable to process request');
      expect(error.status).toBe(409);
      expect(error).toBeInstanceOf(ConflictException);
      expect(
        ruralProducerRepository.checkExistsByDocument
      ).toHaveBeenCalledWith(ruralProducer.document);
      expect(ruralProducerRepository.create).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when an InvalidDocumentException occurs', async () => {
      const ruralProducer = RuralProducerFixture.createRuralProducer();
      ruralProducer.document = '11111111111';

      const data = {
        name: ruralProducer.name,
        document: ruralProducer.document,
      };

      jest
        .spyOn(ruralProducerRepository, 'checkExistsByDocument')
        .mockResolvedValue(false);

      let error;

      try {
        await ruralProducerService.create(data);
      } catch (e) {
        error = e;
      }

      expect(error).toBeDefined();
      expect(error.message).toBe('Unable to process request');
      expect(error.status).toBe(400);
      expect(error).toBeInstanceOf(BadRequestException);
      expect(
        ruralProducerRepository.checkExistsByDocument
      ).toHaveBeenCalledWith(ruralProducer.document);
      expect(ruralProducerRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('#list', () => {
    it('should return a list of rural producers', async () => {
      const ruralProducers = RuralProducerFixture.createManyRuralProducers(3);
      const ruralProducerEntities = ruralProducers.map(producer =>
        RuralProducerFixture.entity({
          document: producer.document,
          id: producer.id,
          name: producer.name,
          createdAt: producer.createdAt,
        })
      );

      jest
        .spyOn(ruralProducerRepository, 'findAll')
        .mockResolvedValue(ruralProducerEntities);

      const result = await ruralProducerService.list();

      expect(result).toEqual(
        ruralProducers.map(ruralProducer => ({
          id: ruralProducer.id,
          name: ruralProducer.name,
          document: ruralProducer.document,
          createdAt: ruralProducer.createdAt,
        }))
      );
      expect(ruralProducerRepository.findAll).toHaveBeenCalled();
    });
  });
});
