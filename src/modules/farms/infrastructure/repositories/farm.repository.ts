import Decimal from 'decimal.js';
import { v4 as uuidv4 } from 'uuid';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { FarmModel } from '@/database/models/farm.model';
import { Farm } from '@/farms/domain/entities/farm.entity';
import { ListFarmsInput } from '@/farms/application/dtos/list-farms.dto';
import { paginatedOptions } from '@/shared/repositories/paginated-options';
import { IFarmRepository } from '@/farms/domain/repositories/farm.repository';
import { FarmCropHarvestModel } from '@/database/models/farm-crop-harvest.model';
import { FarmCropHarvest } from '@/farms/domain/entities/farm-crop-harvest.entity';

export class FarmRepository implements IFarmRepository {
  constructor(
    @InjectRepository(FarmModel)
    private readonly repository: Repository<FarmModel>,
    @InjectRepository(FarmCropHarvestModel)
    private readonly farmCropHarvestRepository: Repository<FarmCropHarvestModel>
  ) {}

  public async create(farm: Farm): Promise<Farm> {
    const createdFarm = this.repository.create({
      id: farm.id,
      name: farm.name,
      city: farm.city,
      state: farm.state,
      ruralProducerId: farm.ruralProducerId,
      totalArea: farm.totalArea.toString(),
      vegetationArea: farm.vegetationArea.toString(),
      agricultureArea: farm.agricultureArea.toString(),
    });

    const newFarm = await this.repository.save(createdFarm);

    return this.mapFarmModelToEntity(newFarm);
  }

  public async findAll(): Promise<Farm[]> {
    const farms = await this.repository.find({
      where: { deletedAt: null },
      order: { createdAt: 'DESC' },
      relations: [
        'farmCropHarvests',
        'farmCropHarvests.crop',
        'farmCropHarvests.harvest',
      ],
    });

    return farms.map(this.mapFarmModelToEntity);
  }

  public async assignCropsToFarm(
    farm: Farm,
    farmCropHarvests: FarmCropHarvest[]
  ): Promise<Farm> {
    const cropHarvestsModel = farmCropHarvests.map(farmCropHarvest => {
      return this.farmCropHarvestRepository.create({
        id: uuidv4(),
        farmId: farm.id,
        cropId: farmCropHarvest.cropId,
        harvestId: farmCropHarvest.harvestId,
        harvestDate: farmCropHarvest.harvestDate,
        plantedArea: farmCropHarvest.plantedArea.toString(),
      });
    });

    await this.farmCropHarvestRepository.save(cropHarvestsModel);

    return Farm.instance({
      ...farm,
      farmCropHarvests: [farm.farmCropHarvests, ...farmCropHarvests].flat(),
    });
  }

  public async findById(id: string): Promise<Farm | null> {
    const farm = await this.repository.findOne({
      where: { id, deletedAt: null },
      relations: [
        'farmCropHarvests',
        'farmCropHarvests.crop',
        'farmCropHarvests.harvest',
      ],
      order: { createdAt: 'DESC' },
    });

    if (!farm) {
      return null;
    }

    return this.mapFarmModelToEntity(farm);
  }

  public async softDelete(id: string): Promise<void> {
    await this.farmCropHarvestRepository.manager.transaction(
      async transaction => {
        await transaction.softDelete(FarmCropHarvestModel, { farmId: id });
        await transaction.softDelete(FarmModel, id);
      }
    );
  }

  public async update(farm: Farm): Promise<void> {
    await this.repository.update(farm.id, {
      name: farm.name,
      city: farm.city,
      state: farm.state,
      ruralProducerId: farm.ruralProducerId,
    });
  }

  private mapFarmModelToEntity(farm: FarmModel): Farm {
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
      farmCropHarvests:
        farm.farmCropHarvests?.map(farmCropHarvest => {
          return FarmCropHarvest.instance({
            cropId: farmCropHarvest.cropId,
            farmId: farmCropHarvest.farmId,
            name: farmCropHarvest.crop.name,
            farmCropHarvestId: farmCropHarvest.id,
            harvestId: farmCropHarvest.harvestId,
            createdAt: farmCropHarvest.createdAt,
            harvestDate: farmCropHarvest.harvestDate,
            harvestYear: farmCropHarvest.harvest.year,
            plantedArea: new Decimal(farmCropHarvest.plantedArea),
          });
        }) || [],
    });
  }

  async deleteFarmCropHarvest(farmCropHarvestId: any): Promise<void> {
    await this.farmCropHarvestRepository.softDelete(farmCropHarvestId);
  }

  async findFarmCropHarvestById(id: string): Promise<FarmCropHarvest | null> {
    const farmCropHarvest = await this.farmCropHarvestRepository.findOne({
      where: { id, deletedAt: null },
      relations: ['crop', 'harvest'],
    });

    if (!farmCropHarvest) {
      return null;
    }

    return FarmCropHarvest.instance({
      cropId: farmCropHarvest.cropId,
      farmId: farmCropHarvest.farmId,
      name: farmCropHarvest.crop.name,
      createdAt: farmCropHarvest.createdAt,
      harvestId: farmCropHarvest.harvestId,
      farmCropHarvestId: farmCropHarvest.id,
      harvestDate: farmCropHarvest.harvestDate,
      harvestYear: farmCropHarvest.harvest.year,
      plantedArea: new Decimal(farmCropHarvest.plantedArea),
    });
  }

  public async findPaginated(input: ListFarmsInput): Promise<[Farm[], number]> {
    const [results, total] = await this.repository.findAndCount({
      where: { deletedAt: null, ...(input.state && { state: input.state }) },
      ...paginatedOptions(input),
      order: { createdAt: 'DESC' },
      relations: [
        'farmCropHarvests',
        'farmCropHarvests.crop',
        'farmCropHarvests.harvest',
      ],
    });

    const farms = results.map(this.mapFarmModelToEntity);

    return [farms, total];
  }
}
