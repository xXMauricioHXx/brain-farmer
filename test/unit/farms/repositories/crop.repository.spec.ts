import { Repository } from 'typeorm';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { CropModel } from '@/database/models/crop.model';
import { CropFixture } from '../../../fixtures/crop.fixture';
import { Crop } from '@/modules/farms/domain/entities/crop.entity';
import { CropRepository } from '@/modules/farms/infrastructure/repositories/crop.repository';

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
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    cropRepository = module.get(CropRepository);
    repository = module.get(getRepositoryToken(CropModel));
  });

  describe('#findById', () => {
    it('should return a crop entity when found', async () => {
      const cropModel = CropFixture.createCrop();

      repository.findOne.mockResolvedValue(cropModel);

      const result = await cropRepository.findById(cropModel.id);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: cropModel.id, deletedAt: null },
      });

      expect(result).toBeInstanceOf(Crop);
      expect(result?.id).toBe(cropModel.id);
      expect(result?.createdAt).toStrictEqual(cropModel.createdAt);
    });

    it('should return null when crop is not found', async () => {
      repository.findOne.mockResolvedValue(null);

      const result = await cropRepository.findById('non-existent-id');

      expect(result).toBeNull();
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 'non-existent-id', deletedAt: null },
      });
    });
  });
});
