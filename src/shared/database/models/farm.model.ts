import { CropModel } from './crop.model';
import { RuralProducerModel } from './rural-producer.model';
import { Entity, Column, PrimaryColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity('tb_farms', { schema: 'public' })
export class FarmModel {
  @PrimaryColumn('uuid')
  id: string;

  @ManyToOne(() => RuralProducerModel, producer => producer.farms, {
    onDelete: 'CASCADE',
  })
  producer: RuralProducerModel;

  @Column('uuid')
  producerId: string;

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

  @OneToMany(() => CropModel, crop => crop.farm)
  crops: CropModel[];
}
