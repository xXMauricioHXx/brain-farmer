import {
  Entity,
  Column,
  PrimaryColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { FarmModel } from './farm.model';

@Entity('tb_rural_producers', { schema: 'public' })
export class RuralProducerModel {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  document: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;

  @OneToMany(() => FarmModel, farm => farm.ruralProducer)
  farms: FarmModel[];
}
