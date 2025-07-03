import { v4 as uuidv4 } from 'uuid';
import {
  Inject,
  Logger,
  Injectable,
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';

import {
  CreateRuralProducerInput,
  CreateRuralProducerOutput,
} from '@/rural-producers/application/dtos/create-rural-producer.dto';
import { RURAL_PRODUCER_REPOSITORY } from '@/shared/repositories/tokens';
import { RuralProducer } from '@/rural-producers/domain/entities/rural-producer.entity';
import { ListRuralProducerOutput } from '@/rural-producers/application/dtos/list-rural-producer.dto';
import { UpdateRuralProducerInput } from '@/rural-producers/application/dtos/update-rural-producer.dto';
import { IRuralProducerRepository } from '@/rural-producers/domain/repositories/rural-producer.repository';
import { InvalidDocumentException } from '@/rural-producers/domain/execeptions/invalid-document.exception';
import { logger } from '@/shared/logger/winston.logger';

@Injectable()
export class RuralProducerService {
  constructor(
    @Inject(RURAL_PRODUCER_REPOSITORY)
    private readonly ruralProducerRepository: IRuralProducerRepository
  ) {}

  async create(
    input: CreateRuralProducerInput
  ): Promise<CreateRuralProducerOutput> {
    try {
      logger.info(
        `Creating rural producer with name: ${input.name} and document: ${input.document}`
      );
      const { name, document } = input;

      const foundRuralProducer =
        await this.ruralProducerRepository.checkExistsByDocument(document);

      if (foundRuralProducer) {
        logger.warn(`Rural producer with document ${document} already exists.`);
        throw new ConflictException('Unable to process request');
      }

      const ruralProducer = RuralProducer.instance({
        id: uuidv4(),
        name,
        document,
      });

      const newRuralProducer =
        await this.ruralProducerRepository.create(ruralProducer);

      return {
        id: newRuralProducer.id,
        name: newRuralProducer.name,
        document: newRuralProducer.document.getValue(),
        createdAt: newRuralProducer.createdAt,
      };
    } catch (error) {
      logger.error(
        `Error creating rural producer: ${error.message}`,
        error.stack
      );

      if (error instanceof InvalidDocumentException) {
        throw new BadRequestException('Unable to process request');
      }

      throw error;
    }
  }

  async list(): Promise<ListRuralProducerOutput[]> {
    logger.info('Listing all rural producers');
    const ruralProducers = await this.ruralProducerRepository.findAll();

    return ruralProducers.map(ruralProducer => ({
      id: ruralProducer.id,
      name: ruralProducer.name,
      document: ruralProducer.document.getValue(),
      createdAt: ruralProducer.createdAt,
    }));
  }

  async findById(id: string): Promise<ListRuralProducerOutput> {
    logger.info(`Finding rural producer by ID: ${id}`);
    const ruralProducer = await this.ruralProducerRepository.findById(id);

    if (!ruralProducer) {
      logger.error(`Rural producer with id ${id} not found.`);
      throw new NotFoundException('Rural producer not found');
    }

    return {
      id: ruralProducer.id,
      name: ruralProducer.name,
      document: ruralProducer.document.getValue(),
      createdAt: ruralProducer.createdAt,
    };
  }

  async update(id: string, input: UpdateRuralProducerInput): Promise<void> {
    logger.info(`Updating rural producer with ID: ${id}`);
    const ruralProducer = await this.ruralProducerRepository.findById(id);

    if (!ruralProducer) {
      logger.error(`Rural producer with id ${id} not found.`);
      throw new NotFoundException('Rural producer not found');
    }

    ruralProducer.name = input.name;

    await this.ruralProducerRepository.update(ruralProducer);
  }

  async delete(id: string): Promise<void> {
    logger.info(`Deleting rural producer with ID: ${id}`);
    const ruralProducer = await this.ruralProducerRepository.findById(id);

    if (!ruralProducer) {
      logger.error(`Rural producer with id ${id} not found.`);
      throw new NotFoundException('Rural producer not found');
    }

    await this.ruralProducerRepository.softDelete(ruralProducer.id);
  }
}
