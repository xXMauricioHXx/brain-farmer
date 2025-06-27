import { IsString, IsUUID } from 'class-validator';
import { BaseEntity } from 'src/shared/contracts/base-entity';
import { Document } from '../value-objects/document.vo';

export type RuralProducerAttributes = {
  id: string;
  name: string;
  document: Document;
};

export class RuralProducer extends BaseEntity {
  @IsUUID()
  id: string;

  @IsString()
  name: string;

  @IsString()
  document: Document;

  private constructor(input: RuralProducerAttributes) {
    super();

    this.id = input.id;
    this.name = input.name;
    this.document = input.document;
  }

  public static instance(input: RuralProducerAttributes): RuralProducer {
    const ruralProducer = new RuralProducer(input);
    ruralProducer.validate();
    return ruralProducer;
  }
}
