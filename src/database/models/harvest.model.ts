import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { FarmCropHarvestModel } from './farm-crop-harvest.model';

@Entity('tb_harvests', { schema: 'public' })
export class HarvestModel {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  year: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  @OneToMany(
    () => FarmCropHarvestModel,
    farmCropHarvest => farmCropHarvest.harvest
  )
  farmCropHarvests: FarmCropHarvestModel[];
}
