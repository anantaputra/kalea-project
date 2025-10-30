export class SystemMasterResponse {
  constructor(
    public id: string,
    public name: string,
    public created_by: string,
    public created_dt: Date,
    public changed_by?: string,
    public changed_dt?: Date,
  ) {}
}
