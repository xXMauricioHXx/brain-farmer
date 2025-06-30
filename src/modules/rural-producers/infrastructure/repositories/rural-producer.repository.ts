import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { RuralProducerModel } from '@/database/models/rural-producer.model';
import { RuralProducer } from '@/rural-producers/domain/entities/rural-producer.entity';
import { IRuralProducerRepository } from '@/rural-producers/domain/repositories/rural-producer.repository';

export class RuralProducerRepository implements IRuralProducerRepository {
  constructor(
    @InjectRepository(RuralProducerModel)
    private readonly repository: Repository<RuralProducerModel>
  ) {}

  public async create(ruralProducer: RuralProducer): Promise<RuralProducer> {
    const createdRuralProducer = this.repository.create({
      id: ruralProducer.id,
      name: ruralProducer.name,
      document: ruralProducer.document.getValue(),
    });

    const newRuralProducer = await this.repository.save(createdRuralProducer);

    return RuralProducer.instance(newRuralProducer);
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

  public async checkExistsById(id: string): Promise<boolean> {
    return this.repository.exists({ where: { id, deletedAt: null } });
  }

  public async checkExistsByDocument(document: string): Promise<boolean> {
    return this.repository.exists({ where: { document, deletedAt: null } });
  }
}
