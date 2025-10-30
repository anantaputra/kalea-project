export class SpkStage {
  constructor(
    public id: string,
    public spk_detail: string = '',
    public stage_name: string = '',
    public seq: number = 0,
    public qty_in: number = 0,
    public qty_reject: number = 0,
    public pic_id: string | null = null,
    public start_dt: Date | null = null,
    public end_dt: Date | null = null,
    public status: string = '',
    public created_by: string = 'system',
    public created_dt: Date = new Date(),
    public changed_by: string | null = null,
    public changed_dt: Date | null = null,
  ) {}
}