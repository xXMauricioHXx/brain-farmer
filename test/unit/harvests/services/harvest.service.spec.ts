import { Test } from '@nestjs/testing';
import { v4 as uuidv4 } from 'uuid';

import { HARVEST_REPOSITORY } from '@/shared/tokens';
import { HarvestFixture } from '../../../fixtures/harvest.fixture';
import { HarvestService } from '@/modules/harvests/application/services/harvest.service';
import { IHarvestRepository } from '@/modules/harvests/domain/repositories/harvest.repository';

jest.mock('uuid', () => ({
  v4: jest.fn(),
}));

describe('HarvestService', () => {
  let harvestService: HarvestService;
  let harvestRepository: jest.Mocked<IHarvestRepository>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        HarvestService,
        {
          provide: HARVEST_REPOSITORY,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    harvestService = module.get(HarvestService);
    harvestRepository = module.get(HARVEST_REPOSITORY);
  });

  describe('#create', () => {
    it('should create a new harvest', async () => {
      const harvestModel = HarvestFixture.createHarvest();
      const harvestEntity = HarvestFixture.entity(harvestModel);
      const input = {
        year: harvestModel.year,
      };

      (uuidv4 as jest.Mock).mockReturnValue(harvestModel.id);
      jest.spyOn(harvestRepository, 'create').mockResolvedValue(harvestEntity);

      const result = await harvestService.create(input);

      expect(uuidv4).toHaveBeenCalled();
      expect(harvestRepository.create).toHaveBeenCalledWith({
        ...harvestEntity,
        createdAt: undefined,
      });
      expect(result).toEqual(harvestEntity);
    });
  });

  describe('#list', () => {
    it('should return all harvests', async () => {
      const harvestsModel = HarvestFixture.createManyHarvest(3);
      const harvestEntities = harvestsModel.map(harvest =>
        HarvestFixture.entity(harvest)
      );

      jest
        .spyOn(harvestRepository, 'findAll')
        .mockResolvedValue(harvestEntities);

      const result = await harvestService.list();

      expect(harvestRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual(harvestEntities);
    });
  });
});
