export type ListFarmsOutput = {
  id: string;
  name: string;
  totalArea: string;
  agricultureArea: string;
  vegetationArea: string;
  state: string;
  city: string;
  ruralProducerId: string;
  createdAt: Date;
  crops: {
    name: string;
    cropId: string;
    harvestId: string;
    createdAt: Date;
    harvestYear: number;
    plantedArea: string;
    harvestDate: string;
    farmCropHarvestId: string;
  }[];
};
