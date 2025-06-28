import { RuralProducerModel } from '@/database/models/rural-producer.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IRuralProducerRepository } from '../../domain/repositories/rural-producer.repository';
import { RuralProducer } from '../../domain/entities/rural-producer.entity';

export class RuralProducerRepository implements IRuralProducerRepository {
  constructor(
    @InjectRepository(RuralProducerModel)
    private readonly repository: Repository<RuralProducerModel>
  ) {}

  async create(ruralProducer: RuralProducer): Promise<RuralProducer> {
    const createdRuralProducer = this.repository.create({
      id: ruralProducer.id,
      name: ruralProducer.name,
      document: ruralProducer.document.getValue(),
    });

    const newRuralProducer = await this.repository.save(createdRuralProducer);

    return RuralProducer.instance(newRuralProducer);
  }

  delete(id: string): Promise<void> {
    throw new Error('Not implemented');
  }

  async findAll(): Promise<RuralProducer[]> {
    const results = await this.repository.find({
      where: { deletedAt: null },
    });

    return results.map(result =>
      RuralProducer.instance({
        id: result.id,
        name: result.name,
        document: result.document,
        createdAt: result.createdAt,
      })
    );
  }

  async findByDocument(document: string): Promise<RuralProducer | null> {
    const ruralProducer = await this.repository.findOne({
      where: { document },
    });

    if (!ruralProducer) return null;

    return RuralProducer.instance({
      id: ruralProducer.id,
      name: ruralProducer.name,
      document: ruralProducer.document,
      createdAt: ruralProducer.createdAt,
    });
  }

  findById(id: string): Promise<RuralProducer | null> {
    throw new Error('Not implemented');
  }

  update(producer: RuralProducer): Promise<RuralProducer> {
    throw new Error('Not implemented');
  }
}
