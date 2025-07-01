import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { FarmModel } from '@/database/models/farm.model';
import { RuralProducerModel } from '@/database/models/rural-producer.model';
import { FarmCropHarvestModel } from '@/database/models/farm-crop-harvest.model';
import { RuralProducer } from '@/rural-producers/domain/entities/rural-producer.entity';
import { IRuralProducerRepository } from '@/rural-producers/domain/repositories/rural-producer.repository';

export class RuralProducerRepository implements IRuralProducerRepository {
  constructor(
    @InjectRepository(RuralProducerModel)
    private readonly repository: Repository<RuralProducerModel>,
    @InjectRepository(FarmCropHarvestModel)
    private readonly farmCropHarvestRepository: Repository<FarmCropHarvestModel>
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
      order: { createdAt: 'DESC' },
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

  public async findById(id: string): Promise<RuralProducer | null> {
    const ruralProducer = await this.repository.findOne({
      where: { id, deletedAt: null },
    });

    if (!ruralProducer) {
      return null;
    }

    return RuralProducer.instance(ruralProducer);
  }

  public async update(ruralProducer: RuralProducer): Promise<RuralProducer> {
    await this.repository.update(ruralProducer.id, {
      name: ruralProducer.name,
    });

    return ruralProducer;
  }

  public async softDelete(id: string): Promise<void> {
    await this.farmCropHarvestRepository.manager.transaction(
      async transaction => {
        const farms = await transaction.find(FarmModel, {
          where: { ruralProducerId: id, deletedAt: null },
        });

        for (const farm of farms) {
          await transaction.softDelete(FarmCropHarvestModel, {
            farmId: farm.id,
          });
          await transaction.softDelete(FarmModel, { id: farm.id });
        }

        await transaction.softDelete(RuralProducerModel, { id });
      }
    );
  }
}
