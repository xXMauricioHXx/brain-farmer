import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
import { FarmModel } from './farm.model';

@Entity('tb_rural_producers', { schema: 'public' })
export class RuralProducerModel {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  document: string;

  @OneToMany(() => FarmModel, (farm) => farm.producer)
  farms: FarmModel[];
}
