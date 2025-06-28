import { CropModel } from './crop.model';
import { RuralProducerModel } from './rural-producer.model';
import {
  Entity,
  Column,
  PrimaryColumn,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity('tb_farms', { schema: 'public' })
export class FarmModel {
  @PrimaryColumn('uuid')
  id: string;

  @ManyToOne(() => RuralProducerModel, ruralProducer => ruralProducer.farms, {
    onDelete: 'CASCADE',
  })
  ruralProducer: RuralProducerModel;

  @Column('uuid', { name: 'rural_producer_id' })
  ruralProducerId: string;

  @Column()
  name: string;

  @Column({ type: 'numeric', precision: 18, scale: 6 })
  totalArea: string;

  @Column({ type: 'numeric', precision: 18, scale: 6 })
  agricultureArea: string;

  @Column({ type: 'numeric', precision: 18, scale: 6 })
  vegetationArea: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;

  @OneToMany(() => CropModel, crop => crop.farm)
  crops: CropModel[];
}
