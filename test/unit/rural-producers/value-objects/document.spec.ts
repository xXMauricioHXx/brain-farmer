import { Document } from '@/rural-producers/domain/value-objects/document.vo';
import { InvalidDocumentException } from '@/rural-producers/domain/execeptions/invalid-document.exception';

describe('Document', () => {
  it('should create a valid CPF document', () => {
    const validCpf = '529.982.247-25';
    const document = Document.create(validCpf);

    expect(document.getValue()).toBe('52998224725');
    expect(document.isCpf()).toBe(true);
    expect(document.isCnpj()).toBe(false);
  });

  it('should create a valid CNPJ document', () => {
    const validCnpj = '45.723.174/0001-10';
    const document = Document.create(validCnpj);

    expect(document.getValue()).toBe('45723174000110');
    expect(document.isCnpj()).toBe(true);
    expect(document.isCpf()).toBe(false);
  });

  it('should throw InvalidDocumentException for invalid CPF/CNPJ', () => {
    const invalid = '123.456.789-00';

    expect(() => Document.create(invalid)).toThrow(InvalidDocumentException);
  });

  it('should return the correct value in toString()', () => {
    const validCpf = '529.982.247-25';
    const document = Document.create(validCpf);

    expect(document.toString()).toBe('52998224725');
  });
});
