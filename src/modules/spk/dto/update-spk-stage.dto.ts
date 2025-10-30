export class UpdateSpkStageDto {
  stage_name?: string;
  seq?: number;
  qty_in?: number;
  qty_reject?: number;
  pic_id?: string;
  start_at?: string; // ISO datetime string
  end_at?: string; // ISO datetime string
  status?: string;
  user_id?: string; // used as changed_by
}