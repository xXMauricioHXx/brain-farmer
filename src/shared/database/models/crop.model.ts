import { Entity, Column, PrimaryColumn, ManyToOne } from 'typeorm';
import { FarmModel } from './farm.model';

@Entity('tb_crops', { schema: 'public' })
export class CropModel {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  harvestYear: number;

  @Column('uuid')
  farmId: string;

  @ManyToOne(() => FarmModel, farm => farm.crops, { onDelete: 'CASCADE' })
  farm: FarmModel;
}
