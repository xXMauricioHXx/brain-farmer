import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { FarmCropHarvestModel } from './farm-crop-harvest.model';

@Entity('tb_crops', { schema: 'public' })
export class CropModel {
  @PrimaryColumn('uuid')
  id: string;

  @Column('varchar', { name: 'name', unique: true })
  name: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt?: Date;

  @OneToMany(
    () => FarmCropHarvestModel,
    farmCropHarvest => farmCropHarvest.crop
  )
  farmCropHarvests: FarmCropHarvestModel[];
}
