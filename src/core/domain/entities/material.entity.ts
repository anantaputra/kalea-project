export class Materials {
  constructor(
    public id?: string,
    public material_code?: string,
    public material_name?: string,
    public barcode?: string,
    public material_category?: string,
    public unit_of_measure?: string,
    public is_active: boolean = true,
    public created_by?: string,
    public created_dt?: Date,
    public changed_by?: string | null,
    public changed_dt?: Date | null,
  ) {}
}