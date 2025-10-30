export class SystemMaster {
  constructor(
    public system_type: string,
    public system_cd: string,
    public system_value: string,
    public created_by: string,
    public created_dt: Date,
    public changed_by?: string,
    public changed_dt?: Date,
  ) {}
}
