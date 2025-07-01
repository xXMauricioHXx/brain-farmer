import { Repository } from 'typeorm';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { CropModel } from '@/database/models/crop.model';
import { Crop } from '@/crops/domain/entities/crop.entity';
import { CropFixture } from '../../../fixtures/crop.fixture';
import { FarmCropHarvestModel } from '@/database/models/farm-crop-harvest.model';
import { CropRepository } from '@/crops/infrastructure/repositories/crop.repository';

describe('CropRepository', () => {
  let cropRepository: CropRepository;
  let repository: jest.Mocked<Repository<CropModel>>;
  let entityManager: jest.Mocked<Repository<FarmCropHarvestModel>>;

  beforeEach(async () => {
    entityManager = {
      transaction: jest.fn(),
      softDelete: jest.fn(),
    } as unknown as jest.Mocked<Repository<FarmCropHarvestModel>>;

    const module = await Test.createTestingModule({
      providers: [
        CropRepository,
        {
          provide: getRepositoryToken(CropModel),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            update: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(FarmCropHarvestModel),
          useValue: {
            manager: {
              transaction: jest
                .fn()
                .mockImplementation(cb => cb(entityManager)),
            },
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
        order: { createdAt: 'DESC' },
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

  describe('#findById', () => {
    it('should return a crop by id', async () => {
      const cropModel = CropFixture.createCrop();
      jest.spyOn(repository, 'findOne').mockResolvedValue(cropModel);

      const result = await cropRepository.findById(cropModel.id);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: cropModel.id, deletedAt: null },
      });

      expect(result).toEqual(
        Crop.instance({
          id: cropModel.id,
          name: cropModel.name,
          createdAt: cropModel.createdAt,
        })
      );
    });

    it('should return null if crop not found', async () => {
      repository.findOne = jest.fn().mockResolvedValue(null);

      const result = await cropRepository.findById('non-existing-id');

      expect(result).toBeNull();
    });
  });

  describe('#update', () => {
    it('should update and return a crop entity', async () => {
      const cropModel = CropFixture.createCrop();
      const cropEntity = Crop.instance({
        id: cropModel.id,
        name: 'Updated Crop',
        createdAt: cropModel.createdAt,
      });

      const result = await cropRepository.update(cropEntity);

      expect(repository.update).toHaveBeenCalledWith(cropEntity.id, {
        name: cropEntity.name,
        updatedAt: expect.any(Date),
      });

      expect(result).toEqual(cropEntity);
    });
  });

  describe('#softDelete', () => {
    it('should soft delete a crop by id', async () => {
      const cropId = 'crop-id';

      await cropRepository.softDelete(cropId);

      expect(entityManager.softDelete).toHaveBeenNthCalledWith(
        1,
        FarmCropHarvestModel,
        { cropId }
      );
      expect(entityManager.softDelete).toHaveBeenNthCalledWith(
        2,
        CropModel,
        cropId
      );
    });
  });
});
