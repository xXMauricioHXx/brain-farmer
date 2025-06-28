import { v4 as uuidv4 } from 'uuid';
import {
  Inject,
  Logger,
  Injectable,
  BadRequestException,
  ConflictException,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  CreateRuralProducerInput,
  CreateRuralProducerOutput,
} from '../dtos/create-rural-producer.dto';
import { RuralProducer } from '../../domain/entities/rural-producer.entity';
import { IRuralProducerRepository } from '../../domain/repositories/rural-producer.repository';
import { RURAL_PRODUCER_REPOSITORY } from '@/shared/tokens/repositories/rural-producer.repository.token';
import { InvalidDocumentException } from '../../domain/execeptions/invalid-document.exception';
import { ListRuralProducerOutput } from '../dtos/list-rural-producer.dto';

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
        await this.ruralProducerRepository.findByDocument(document);

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

      const newRuralProducer = await this.ruralProducerRepository.create(ruralProducer);

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

      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'An unexpected error occurred while creating the rural producer.'
      );
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
}
