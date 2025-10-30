export class ProductVariant {
  constructor(
    public id: string,
    public article_id: string,
    public product_name: string,
    public size: string,
    public color: string | null = null,
    public barcode: string | null = null,
    public sku: string | null = null,
    public price: number,
    public cost_price: number,
    public is_active: boolean = true,
    public created_by: string = 'system',
    public created_dt: Date = new Date(),
    public changed_by: string = 'system',
    public changed_dt: Date = new Date(),
  ) {}
}
