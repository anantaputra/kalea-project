export class BomItem {
  constructor(
    public id?: string,
    public product_variant_id?: string,
    public material_id?: string,
    public qty_per_unit?: number,
    public condition_color: string | null = null,
    public waste_pct?: number,
    public created_by: string = 'system',
    public created_dt: Date = new Date(),
    public changed_by: string = 'system',
    public changed_dt: Date = new Date(),
    public product_variant?: {
      id: string;
      product_name: string;
      size: string;
      color: string | null;
      sku: string | null;
    } | null,
    public material?: {
      id: string;
      material_name: string;
      material_category: string;
      unit_of_measure: string;
    } | null,
  ) {}
}
