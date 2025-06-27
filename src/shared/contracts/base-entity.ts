import { validateSync, ValidationError } from 'class-validator';

export class BaseEntity {
  validate() {
    const errors = validateSync(this, {
      whitelist: false,
    });

    if (errors.length) {
      throw new Error(this.formatValidationErrors(errors));
    }
  }

  private formatValidationErrors(errors: ValidationError[]): string {
    return errors
      .map((error) => {
        const constraints = error.constraints
          ? Object.values(error.constraints).join(', ')
          : 'Unknown validation error';
        return `${error.property}: ${constraints}`;
      })
      .join('\n');
  }
}
