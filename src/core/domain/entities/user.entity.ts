export class User {
  constructor(
    public id: string,
    public first_name: string,
    public last_name: string | null = null,
    public username: string,
    public email: string,
    public password: string,
    public is_active: boolean = true,
    public role: string,
    public created_by: string = 'system',
    public created_dt: Date = new Date(),
    public changed_by: string = 'system',
    public changed_dt: Date = new Date(),
  ) {}
}
