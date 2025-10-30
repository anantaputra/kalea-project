export class Article {
  constructor(
    public id: string,
    public article_name: string,
    public description: string | null = null,
    public is_active: boolean = true,
    public created_by: string = 'system',
    public created_dt: Date = new Date(),
    public changed_by: string = 'system',
    public changed_dt: Date = new Date(),
  ) {}
}
