export class Vendor {
  constructor(
    public id: string,
    public name: string,
    public contact_person: string,
    public phone: string,
    public email: string,
    public address: string,
    public city: string | null = null,
    public province: string | null = null,
    public country: string | null = null,
    public zip_code: string | null = null,
    public tax_number: string | null = null,
    public is_active: boolean = true,
    public created_by: string = 'system',
    public created_dt: Date = new Date(),
    public changed_by: string = 'system',
    public changed_dt: Date = new Date(),
  ) {}
}
