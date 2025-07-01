import { cpf } from 'cpf-cnpj-validator';
import { faker } from '@faker-js/faker/.';

import { RuralProducerModel } from '@/database/models/rural-producer.model';
import { RuralProducer } from '@/rural-producers/domain/entities/rural-producer.entity';

export class RuralProducerFixture {
  public static createRuralProducer(): RuralProducerModel {
    const rawDocument = cpf.generate();

    const ruralProducer = new RuralProducerModel();
    ruralProducer.id = faker.string.uuid();
    ruralProducer.name = faker.person.fullName();
    ruralProducer.document = rawDocument;
    ruralProducer.createdAt = new Date();
    ruralProducer.updatedAt = new Date();
    ruralProducer.deletedAt = null;

    return ruralProducer;
  }

  public static entity(data: RuralProducerModel): RuralProducer {
    return RuralProducer.instance(data);
  }

  static createManyRuralProducers(count: number): RuralProducerModel[] {
    return Array.from({ length: count }, () => this.createRuralProducer());
  }
}
