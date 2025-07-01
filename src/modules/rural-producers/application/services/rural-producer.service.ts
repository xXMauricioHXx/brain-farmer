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
import { RURAL_PRODUCER_REPOSITORY } from '@/shared/tokens';
import { RuralProducer } from '@/rural-producers/domain/entities/rural-producer.entity';
import { ListRuralProducerOutput } from '@/rural-producers/application/dtos/list-rural-producer.dto';
import { UpdateRuralProducerInput } from '@/rural-producers/application/dtos/update-rural-producer.dto';
import { IRuralProducerRepository } from '@/rural-producers/domain/repositories/rural-producer.repository';
import { InvalidDocumentException } from '@/rural-producers/domain/execeptions/invalid-document.exception';

@Injectable()
export class RuralProducerService {
  private logger: Logger;

  constructor(
    @Inject(RURAL_PRODUCER_REPOSITORY)
    private readonly ruralProducerRepository: IRuralProducerRepository
  ) {
    this.logger = new Logger(RuralProducerService.name);
  }

  async create(
    input: CreateRuralProducerInput
  ): Promise<CreateRuralProducerOutput> {
    try {
      const { name, document } = input;

      const foundRuralProducer =
        await this.ruralProducerRepository.checkExistsByDocument(document);

      if (foundRuralProducer) {
        this.logger.warn(
          `Rural producer with provided document already exists.`
        );
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
      this.logger.error(
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
    const ruralProducers = await this.ruralProducerRepository.findAll();

    this.logger.log(`Found ${ruralProducers.length} rural producers.`);
    return ruralProducers.map(ruralProducer => ({
      id: ruralProducer.id,
      name: ruralProducer.name,
      document: ruralProducer.document.getValue(),
      createdAt: ruralProducer.createdAt,
    }));
  }

  async findById(id: string): Promise<ListRuralProducerOutput> {
    const ruralProducer = await this.ruralProducerRepository.findById(id);

    if (!ruralProducer) {
      this.logger.warn(`Rural producer with id ${id} not found.`);
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
    const ruralProducer = await this.ruralProducerRepository.findById(id);

    if (!ruralProducer) {
      this.logger.warn(`Rural producer with id ${id} not found.`);
      throw new NotFoundException('Rural producer not found');
    }

    ruralProducer.name = input.name;

    await this.ruralProducerRepository.update(ruralProducer);
  }

  async delete(id: string): Promise<void> {
    const ruralProducer = await this.ruralProducerRepository.findById(id);

    if (!ruralProducer) {
      this.logger.warn(`Rural producer with id ${id} not found.`);
      throw new NotFoundException('Rural producer not found');
    }

    await this.ruralProducerRepository.softDelete(ruralProducer.id);
  }
}
