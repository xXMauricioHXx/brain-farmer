import { FarmCropHarvestModel } from './farm-crop-harvest.model';
import { RuralProducerModel } from './rural-producer.model';
import {
  Entity,
  Column,
  PrimaryColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  JoinColumn,
  OneToMany,
} from 'typeorm';

@Entity('tb_farms', { schema: 'public' })
export class FarmModel {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ name: 'rural_producer_id', type: 'uuid' })
  ruralProducerId: string;

  @Column()
  name: string;

  @Column({ type: 'numeric', precision: 18, scale: 6, name: 'total_area' })
  totalArea: string;

  @Column({
    type: 'numeric',
    precision: 18,
    scale: 6,
    name: 'agriculture_area',
  })
  agricultureArea: string;

  @Column({ type: 'numeric', precision: 18, scale: 6, name: 'vegetation_area' })
  vegetationArea: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt?: Date;

  @ManyToOne(() => RuralProducerModel, ruralProducer => ruralProducer.farms, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'rural_producer_id' })
  ruralProducer: RuralProducerModel;

  @OneToMany(
    () => FarmCropHarvestModel,
    farmCropHarvest => farmCropHarvest.farm
  )
  farmCropHarvests: FarmCropHarvestModel[];
}
