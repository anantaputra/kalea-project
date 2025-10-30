export class MaterialCategoryType {
  public static readonly MATERIAL_CATEGORY = 'MATERIAL_CATEGORY';

  constructor(readonly value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('MaterialCategoryType value cannot be empty');
    }
  }

  static from(value: string): string {
    return MaterialCategoryType.MATERIAL_CATEGORY;
  }

  getValue(): string {
    return this.value;
  }

  equals(other: MaterialCategoryType): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
