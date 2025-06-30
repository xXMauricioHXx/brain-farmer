import { Repository } from 'typeorm';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { CropModel } from '@/database/models/crop.model';
import { CropFixture } from '../../../fixtures/crop.fixture';
import { Crop } from '@/modules/crops/domain/entities/crop.entity';
import { CropRepository } from '@/modules/crops/infrastructure/repositories/crop.repository';

describe('CropRepository', () => {
  let cropRepository: CropRepository;
  let repository: jest.Mocked<Repository<CropModel>>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        CropRepository,
        {
          provide: getRepositoryToken(CropModel),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    cropRepository = module.get(CropRepository);
    repository = module.get(getRepositoryToken(CropModel));
  });

  describe('#create', () => {
    it('should create and return a crop entity', async () => {
      const cropModel = CropFixture.createCrop();
      const cropEntity = Crop.instance({
        id: cropModel.id,
        name: cropModel.name,
        createdAt: cropModel.createdAt,
      });

      jest.spyOn(repository, 'create').mockReturnValue(cropModel);
      jest.spyOn(repository, 'save').mockResolvedValue(cropModel);

      const result = await cropRepository.create(cropEntity);

      expect(repository.create).toHaveBeenCalledWith({
        id: cropEntity.id,
        name: cropEntity.name,
        createdAt: cropEntity.createdAt,
      });

      expect(result).toEqual(cropEntity);
    });
  });

  describe('#findAll', () => {
    it('should return all crops that are not soft deleted', async () => {
      const cropModels = CropFixture.createManyCrops(2);
      repository.find.mockResolvedValue(cropModels);

      const result = await cropRepository.findAll();

      expect(repository.find).toHaveBeenCalledWith({
        where: { deletedAt: null },
      });

      expect(result).toEqual(
        cropModels.map(crop =>
          Crop.instance({
            id: crop.id,
            name: crop.name,
            createdAt: crop.createdAt,
          })
        )
      );
    });
  });
});
