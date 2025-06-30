import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { FarmModel } from './farm.model';
import { CropModel } from './crop.model';
import { HarvestModel } from './harvest.model';

@Entity('tb_farm_crop_harvests', { schema: 'public' })
@Unique(['farmId', 'cropId', 'harvestId'])
export class FarmCropHarvestModel {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ name: 'farm_id', type: 'uuid' })
  farmId: string;

  @Column({ name: 'crop_id', type: 'uuid' })
  cropId: string;

  @Column({ name: 'harvest_id', type: 'uuid' })
  harvestId: string;

  @Column({ name: 'planted_area', type: 'numeric', precision: 18, scale: 6 })
  plantedArea: string;

  @Column({ name: 'harvest_date', type: 'date' })
  harvestDate: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt?: Date;

  @ManyToOne(() => FarmModel, farm => farm.farmCropHarvests)
  @JoinColumn({ name: 'farm_id' })
  farm: FarmModel;

  @ManyToOne(() => CropModel, crop => crop.farmCropHarvests)
  @JoinColumn({ name: 'crop_id' })
  crop: CropModel;

  @ManyToOne(() => HarvestModel, harvest => harvest.farmCropHarvests)
  @JoinColumn({ name: 'harvest_id' })
  harvest: HarvestModel;
}
