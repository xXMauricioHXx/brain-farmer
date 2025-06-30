import { DomainException } from '@/shared/exceptions/domain.exception';

export class PlantedAreaExceedsLimitException extends DomainException {
  public readonly code = 'PLANTED_AREA_EXCEEDS_LIMIT';

  constructor(totalPlanted: string, agricultureLimit: string) {
    super(
      `Planted area (${totalPlanted}) exceeds the available agriculture area (${agricultureLimit})`
    );
  }
}
