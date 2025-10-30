export class RoleType {
  public static readonly ROLE = 'ROLE';

  constructor(readonly value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('RoleType value cannot be empty');
    }
  }

  static from(value: string): string {
    return RoleType.ROLE;
  }

  getValue(): string {
    return this.value;
  }

  equals(other: RoleType): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
