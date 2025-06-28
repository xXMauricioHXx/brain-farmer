import { RuralProducer } from '../entities/rural-producer.entity';

export interface IRuralProducerRepository {
  create(producer: RuralProducer): Promise<RuralProducer>;
  update(producer: RuralProducer): Promise<RuralProducer>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<RuralProducer | null>;
  findAll(): Promise<RuralProducer[]>;
  findByDocument(document: string): Promise<RuralProducer | null>;
}
