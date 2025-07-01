import { DomainException } from '@/shared/exceptions/domain.exception';

export class InvalidFarmAreaException extends DomainException {
  public readonly code = 'INVALID_FARM_AREA';

  constructor(total: string, agriculture: string, vegetation: string) {
    super(
      `Invalid areas: agriculture (${agriculture}) + vegetation (${vegetation}) exceeds total area (${total})`
    );
  }
}
