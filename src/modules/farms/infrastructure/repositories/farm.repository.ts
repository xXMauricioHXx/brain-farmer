import Decimal from 'decimal.js';
import { v4 as uuidv4 } from 'uuid';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { FarmModel } from '@/database/models/farm.model';
import { Farm } from '@/farms/domain/entities/farm.entity';
import { Crop } from '@/farms/domain/entities/crop.entity';
import { Harvest } from '@/farms/domain/entities/harvest.entity';
import { IFarmRepository } from '@/farms/domain/repositories/farm.repository';
import { FarmCropHarvestModel } from '@/database/models/farm-crop-harvest.model';

export class FarmRepository implements IFarmRepository {
  constructor(
    @InjectRepository(FarmModel)
    private readonly repository: Repository<FarmModel>,
    @InjectRepository(FarmCropHarvestModel)
    private readonly farmCropHarvestRepository: Repository<FarmCropHarvestModel>
  ) {}

  public async create(farm: Farm): Promise<Farm> {
    const createdFarm = this.repository.create({
      ...farm,
      agricultureArea: farm.agricultureArea.toString(),
      totalArea: farm.totalArea.toString(),
      vegetationArea: farm.vegetationArea.toString(),
    });

    const newFarm = await this.repository.save(createdFarm);

    return Farm.instance({
      id: newFarm.id,
      city: newFarm.city,
      name: newFarm.name,
      state: newFarm.state,
      createdAt: newFarm.createdAt,
      ruralProducerId: newFarm.ruralProducerId,
      totalArea: new Decimal(newFarm.totalArea),
      vegetationArea: new Decimal(newFarm.vegetationArea),
      agricultureArea: new Decimal(newFarm.agricultureArea),
    });
  }

  public async findAll(): Promise<Farm[]> {
    const farms = await this.repository.find({
      where: { deletedAt: null },
      order: { createdAt: 'DESC' },
    });

    return farms.map(farm =>
      Farm.instance({
        id: farm.id,
        city: farm.city,
        name: farm.name,
        state: farm.state,
        createdAt: farm.createdAt,
        ruralProducerId: farm.ruralProducerId,
        totalArea: new Decimal(farm.totalArea),
        vegetationArea: new Decimal(farm.vegetationArea),
        agricultureArea: new Decimal(farm.agricultureArea),
      })
    );
  }

  public async assignCropsToFarm(farm: Farm, crops: Crop[]): Promise<Farm> {
    const cropHarvests = crops.map(crop => {
      return this.farmCropHarvestRepository.create({
        id: uuidv4(),
        farmId: farm.id,
        cropId: crop.id,
        harvestId: crop.harvest.id,
        harvestDate: crop.harvestDate,
        plantedArea: crop.plantedArea.toString(),
      });
    });

    await this.farmCropHarvestRepository.save(cropHarvests);

    return Farm.instance({
      ...farm,
      crops: [farm.crops, ...crops].flat(),
    });
  }

  public async findById(id: string): Promise<Farm | null> {
    const farm = await this.repository.findOne({
      where: { id, deletedAt: null },
      relations: ['farmCropHarvests', 'farmCropHarvests.harvest'],
      order: { createdAt: 'DESC' },
    });

    if (!farm) {
      return null;
    }

    return Farm.instance({
      id: farm.id,
      city: farm.city,
      name: farm.name,
      state: farm.state,
      createdAt: farm.createdAt,
      ruralProducerId: farm.ruralProducerId,
      totalArea: new Decimal(farm.totalArea),
      vegetationArea: new Decimal(farm.vegetationArea),
      agricultureArea: new Decimal(farm.agricultureArea),
      crops: farm.farmCropHarvests.map(farmCropHarvest => {
        return Crop.instance({
          id: farmCropHarvest.cropId,
          harvestDate: farmCropHarvest.harvestDate,
          plantedArea: new Decimal(farmCropHarvest.plantedArea),
          harvest: Harvest.instance({
            id: farmCropHarvest.harvest.id,
            year: farmCropHarvest.harvest.year,
            createdAt: farmCropHarvest.harvest.createdAt,
          }),
          createdAt: farmCropHarvest.createdAt,
        });
      }),
    });
  }
}
