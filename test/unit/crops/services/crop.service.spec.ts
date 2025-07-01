import { v4 as uuidv4 } from 'uuid';
import { Test } from '@nestjs/testing';

import { CROP_REPOSITORY } from '@/shared/tokens';
import { Crop } from '@/crops/domain/entities/crop.entity';
import { CropFixture } from '../../../fixtures/crop.fixture';
import { CropService } from '@/crops/application/services/crop.service';
import { ICropRepository } from '@/crops/domain/repositories/crop.repository';

jest.mock('uuid', () => ({
  v4: jest.fn(),
}));

describe('CropService', () => {
  let cropService: CropService;
  let cropRepository: ICropRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        CropService,
        {
          provide: CROP_REPOSITORY,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findById: jest.fn(),
            update: jest.fn(),
            softDelete: jest.fn(),
          },
        },
      ],
    }).compile();

    cropService = module.get(CropService);
    cropRepository = module.get(CROP_REPOSITORY);
  });

  describe('#create', () => {
    it('should create a crop successfully', async () => {
      const cropModel = CropFixture.createCrop();
      const cropEntity = Crop.instance({
        id: cropModel.id,
        name: cropModel.name,
      });

      const input = {
        name: cropModel.name,
      };

      (uuidv4 as jest.Mock).mockReturnValue(cropModel.id);
      jest.spyOn(cropRepository, 'create').mockResolvedValue({
        ...cropEntity,
        createdAt: cropModel.createdAt,
      } as Crop);

      const result = await cropService.create(input);

      expect(result).toEqual({
        id: cropModel.id,
        name: cropModel.name,
        createdAt: cropModel.createdAt,
      });

      expect(cropRepository.create).toHaveBeenCalledWith(cropEntity);
    });
  });

  describe('#findAll', () => {
    it('should return all crops', async () => {
      const cropModels = CropFixture.createManyCrops(3);
      const cropEntities = cropModels.map(model =>
        Crop.instance({
          id: model.id,
          name: model.name,
        })
      );

      const mockedEntities = cropEntities.map((entity, index) => ({
        ...entity,
        createdAt: cropModels[index].createdAt,
      })) as Crop[];

      jest.spyOn(cropRepository, 'findAll').mockResolvedValue(mockedEntities);

      const result = await cropService.findAll();

      expect(result).toEqual(
        mockedEntities.map(crop => ({
          id: crop.id,
          name: crop.name,
          createdAt: crop.createdAt,
        }))
      );

      expect(cropRepository.findAll).toHaveBeenCalled();
    });
  });

  describe('#findById', () => {
    it('should return a crop by id', async () => {
      const cropModel = CropFixture.createCrop();
      const cropEntity = CropFixture.entity(cropModel);

      jest.spyOn(cropRepository, 'findById').mockResolvedValue(cropEntity);

      const result = await cropService.findById(cropModel.id);

      expect(result).toEqual({
        id: cropModel.id,
        name: cropModel.name,
        createdAt: cropModel.createdAt,
      });

      expect(cropRepository.findById).toHaveBeenCalledWith(cropModel.id);
    });

    it('should throw NotFoundException if crop not found', async () => {
      const id = uuidv4();
      jest.spyOn(cropRepository, 'findById').mockResolvedValue(null);

      await expect(cropService.findById(id)).rejects.toThrow(
        `Crop with id ${id} not found`
      );

      expect(cropRepository.findById).toHaveBeenCalledWith(id);
    });
  });

  describe('#update', () => {
    it('should update a crop successfully', async () => {
      const cropModel = CropFixture.createCrop();
      const cropEntity = CropFixture.entity(cropModel);

      const input = {
        name: 'Updated Crop Name',
      };

      jest.spyOn(cropRepository, 'findById').mockResolvedValue(cropEntity);

      await cropService.update(cropModel.id, input);

      expect(cropRepository.findById).toHaveBeenCalledWith(cropModel.id);
      expect(cropRepository.update).toHaveBeenCalledWith({
        ...cropEntity,
        name: input.name,
      });
    });

    it('should throw NotFoundException if crop not found', async () => {
      const id = uuidv4();
      const input = {
        name: 'Updated Crop Name',
      };

      jest.spyOn(cropRepository, 'findById').mockResolvedValue(null);

      await expect(cropService.update(id, input)).rejects.toThrow(
        `Crop with id ${id} not found`
      );

      expect(cropRepository.findById).toHaveBeenCalledWith(id);
      expect(cropRepository.update).not.toHaveBeenCalled();
    });
  });

  describe('#delete', () => {
    it('should delete a crop successfully', async () => {
      const cropModel = CropFixture.createCrop();
      const cropEntity = CropFixture.entity(cropModel);

      jest.spyOn(cropRepository, 'findById').mockResolvedValue(cropEntity);

      await cropService.delete(cropModel.id);

      expect(cropRepository.findById).toHaveBeenCalledWith(cropModel.id);
      expect(cropRepository.softDelete).toHaveBeenCalledWith(cropModel.id);
    });

    it('should throw NotFoundException if crop not found', async () => {
      const id = uuidv4();

      jest.spyOn(cropRepository, 'findById').mockResolvedValue(null);

      await expect(cropService.delete(id)).rejects.toThrow(
        `Crop with id ${id} not found`
      );

      expect(cropRepository.findById).toHaveBeenCalledWith(id);
      expect(cropRepository.softDelete).not.toHaveBeenCalled();
    });
  });
});
