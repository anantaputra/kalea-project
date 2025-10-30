export class UnitOfMeasureType {
  public static readonly UNIT_OF_MEASURE = 'UNIT_OF_MEASURE';

  constructor(readonly value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('UnitOfMeasureType value cannot be empty');
    }
  }

  static from(value: string): string {
    return UnitOfMeasureType.UNIT_OF_MEASURE;
  }

  getValue(): string {
    return this.value;
  }

  equals(other: UnitOfMeasureType): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
