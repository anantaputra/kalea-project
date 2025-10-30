export class CreateSpkStageDto {
  spk_detail_id!: string;
  stage_name!: string;
  seq!: number;
  qty_in?: number;
  qty_reject?: number;
  pic_id!: string;
  start_at?: string; // ISO datetime string
  end_at?: string; // ISO datetime string
  status!: string;
  user_id?: string;
}