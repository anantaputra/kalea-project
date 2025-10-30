import { SpkStage } from '../entities/spk-stage.entity';

export interface SpkStageRepository {
  findById(id: string): Promise<SpkStage | null>;
  findAll(): Promise<SpkStage[]>;
  create(entity: SpkStage): Promise<SpkStage>;
  update(entity: SpkStage): Promise<SpkStage>;
}

export const SPK_STAGE_REPOSITORY = Symbol('SpkStageRepository');