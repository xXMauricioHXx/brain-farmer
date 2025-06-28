import { DomainException } from '@/shared/exceptions/domain.exception';

export class InvalidDocumentException extends DomainException {
  public readonly code = 'INVALID_DOCUMENT';

  constructor(document: string) {
    super(`Invalid document: ${document}`);
  }
}
