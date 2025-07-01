import { v4 as uuidv4 } from 'uuid';
import { Test } from '@nestjs/testing';
import { BadRequestException, ConflictException } from '@nestjs/common';

import { RURAL_PRODUCER_REPOSITORY } from '@/shared/repositories/tokens';
import { RuralProducerFixture } from '../../../fixtures/rural-producer.fixture';
import { RuralProducer } from '@/rural-producers/domain/entities/rural-producer.entity';
import { RuralProducerService } from '@/rural-producers/application/services/rural-producer.service';
import { IRuralProducerRepository } from '@/rural-producers/domain/repositories/rural-producer.repository';

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
            findById: jest.fn(),
            update: jest.fn(),
            softDelete: jest.fn(),
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

      const ruralProducerEntity = RuralProducerFixture.entity(ruralProducer);

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
      expect(ruralProducerRepository.create).toHaveBeenCalledWith({
        ...ruralProducerEntity,
        createdAt: undefined,
      });
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
        RuralProducerFixture.entity(producer)
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

  describe('#findById', () => {
    it('should find a rural producer by id', async () => {
      const ruralProducer = RuralProducerFixture.createRuralProducer();
      const ruralProducerEntity = RuralProducerFixture.entity(ruralProducer);

      jest
        .spyOn(ruralProducerRepository, 'findById')
        .mockResolvedValue(ruralProducerEntity);

      const result = await ruralProducerService.findById(ruralProducer.id);

      expect(result).toEqual({
        id: ruralProducer.id,
        name: ruralProducer.name,
        document: ruralProducer.document,
        createdAt: ruralProducer.createdAt,
      });
    });

    it('should throw NotFoundException if rural producer not found', async () => {
      const ruralProducerId = 'non-existing-id';

      jest.spyOn(ruralProducerRepository, 'findById').mockResolvedValue(null);

      let error;
      try {
        await ruralProducerService.findById(ruralProducerId);
      } catch (e) {
        error = e;
      }

      expect(error).toBeDefined();
      expect(error.message).toBe('Rural producer not found');
      expect(error.status).toBe(404);
    });
  });

  describe('#update', () => {
    it('should update a rural producer', async () => {
      const ruralProducer = RuralProducerFixture.createRuralProducer();
      const updatedName = 'Updated Name';
      const ruralProducerEntity = RuralProducerFixture.entity(ruralProducer);

      jest
        .spyOn(ruralProducerRepository, 'findById')
        .mockResolvedValue(ruralProducerEntity);

      jest.spyOn(ruralProducerRepository, 'update').mockResolvedValue({
        ...ruralProducerEntity,
        name: updatedName,
      } as RuralProducer);

      await ruralProducerService.update(ruralProducer.id, {
        name: updatedName,
      });

      expect(ruralProducerRepository.findById).toHaveBeenCalledWith(
        ruralProducer.id
      );
      expect(ruralProducerRepository.update).toHaveBeenCalledWith(
        expect.objectContaining({ id: ruralProducer.id, name: updatedName })
      );
    });

    it('should throw NotFoundException if rural producer not found', async () => {
      const ruralProducerId = 'non-existing-id';

      jest.spyOn(ruralProducerRepository, 'findById').mockResolvedValue(null);

      let error;
      try {
        await ruralProducerService.update(ruralProducerId, {
          name: 'New Name',
        });
      } catch (e) {
        error = e;
      }

      expect(error).toBeDefined();
      expect(error.message).toBe('Rural producer not found');
      expect(error.status).toBe(404);
    });
  });

  describe('#delete', () => {
    it('should delete a rural producer', async () => {
      const ruralProducer = RuralProducerFixture.createRuralProducer();

      jest
        .spyOn(ruralProducerRepository, 'findById')
        .mockResolvedValue(RuralProducerFixture.entity(ruralProducer));

      await ruralProducerService.delete(ruralProducer.id);

      expect(ruralProducerRepository.findById).toHaveBeenCalledWith(
        ruralProducer.id
      );
      expect(ruralProducerRepository.softDelete).toHaveBeenCalledWith(
        ruralProducer.id
      );
    });

    it('should throw NotFoundException if rural producer not found', async () => {
      const ruralProducerId = 'non-existing-id';

      jest.spyOn(ruralProducerRepository, 'findById').mockResolvedValue(null);

      let error;
      try {
        await ruralProducerService.delete(ruralProducerId);
      } catch (e) {
        error = e;
      }

      expect(error).toBeDefined();
      expect(error.message).toBe('Rural producer not found');
      expect(error.status).toBe(404);
    });
  });
});
