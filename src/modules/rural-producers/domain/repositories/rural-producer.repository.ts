import { RuralProducer } from '../entities/rural-producer.entity';

export interface IRuralProducerRepository {
  create(producer: RuralProducer): Promise<RuralProducer>;
  findAll(): Promise<RuralProducer[]>;
  checkExistsById(id: string): Promise<boolean>;
  checkExistsByDocument(document: string): Promise<boolean>;
  findById(id: string): Promise<RuralProducer | null>;
  update(producer: RuralProducer): Promise<RuralProducer>;
  softDelete(id: string): Promise<void>;
}
