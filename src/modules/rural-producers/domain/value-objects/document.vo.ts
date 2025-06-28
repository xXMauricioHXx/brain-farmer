import { cpf, cnpj } from 'cpf-cnpj-validator';
import { InvalidDocumentException } from '../execeptions/invalid-document.exception';

export class Document {
  private constructor(private readonly value: string) {}

  public static create(raw: string): Document {
    const cleaned = raw.replace(/\D/g, '');

    if (!cpf.isValid(cleaned) && !cnpj.isValid(cleaned)) {
      throw new InvalidDocumentException(cleaned);
    }

    return new Document(cleaned);
  }

  public getValue(): string {
    return this.value;
  }

  public isCpf(): boolean {
    return cpf.isValid(this.value);
  }

  public isCnpj(): boolean {
    return cnpj.isValid(this.value);
  }

  public toString(): string {
    return this.value;
  }
}
