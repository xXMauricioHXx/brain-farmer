import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { BaseEntity } from '@/shared/contracts/base-entity';
import { Document } from '../value-objects/document.vo';

export type RuralProducerAttributes = {
  id: string;
  name: string;
  document: string;
  createdAt?: Date;
};

export class RuralProducer extends BaseEntity {
  @IsUUID()
  id: string;

  @IsString()
  name: string;

  @IsNotEmpty()
  document: Document;

  @IsDate()
  @IsOptional()
  createdAt: Date;

  private constructor(input: RuralProducerAttributes) {
    super();

    this.id = input.id;
    this.name = input.name;
    this.createdAt = input.createdAt;
    this.document = Document.create(input.document);
  }

  public static instance(input: RuralProducerAttributes): RuralProducer {
    const ruralProducer = new RuralProducer(input);
    ruralProducer.validate();
    return ruralProducer;
  }
}
