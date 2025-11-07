export class Spk {
  constructor(
    public id: string,
    public spk_no: string = '',
    public barcode: string | null = null,
    public buyer: string = '',
    public spk_date: Date = new Date(),
    public deadline: Date = new Date(),
    public status: string = '',
    public notes: string | null = null,
    public sewing_cost: number | null = null,
    public created_by: string = 'system',
    public created_dt: Date = new Date(),
    public changed_by: string | null = null,
    public changed_dt: Date | null = null,
  ) {}
}
