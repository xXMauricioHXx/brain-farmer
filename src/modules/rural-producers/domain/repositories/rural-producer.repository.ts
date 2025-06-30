import { RuralProducer } from '../entities/rural-producer.entity';

export interface IRuralProducerRepository {
  create(producer: RuralProducer): Promise<RuralProducer>;
  findAll(): Promise<RuralProducer[]>;
  checkExistsById(id: string): Promise<boolean>;
  checkExistsByDocument(document: string): Promise<boolean>;
}
