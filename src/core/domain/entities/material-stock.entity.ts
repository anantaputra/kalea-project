export class MaterialStock {
  constructor(
    public id?: string,
    public material_id?: string,
    public qty?: number,
    public is_approved: boolean = true,
    public created_by?: string,
    public created_dt?: Date,
    public changed_by?: string | null,
    public changed_dt?: Date | null,
  ) {}
}