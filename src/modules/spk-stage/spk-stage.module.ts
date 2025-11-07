import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpkStageController } from './spk-stage.controller';
import { SpkStageService } from './spk-stage.service';
import { SpkStageEntity } from '../../infrastructure/database/typeorm/entities/SpkStage.entity';
import { SpkStageHistoryEntity } from '../../infrastructure/database/typeorm/entities/SpkStageHistory.entity';
import { SpkDetailEntity } from '../../infrastructure/database/typeorm/entities/SpkDetail.entity';
import { SPK_STAGE_REPOSITORY } from '../../core/domain/repositories/spk-stage.repository.interface';
import { SpkStageRepository } from '../../infrastructure/database/typeorm/repositories/spk-stage.repository';
import { SpkEntity } from '../../infrastructure/database/typeorm/entities/Spk.entity';
import { SpkBomEntity } from '../../infrastructure/database/typeorm/entities/SpkBom.entity';
import { BomItemEntity } from '../../infrastructure/database/typeorm/entities/BomItem.entity';
import { SPK_REPOSITORY, SpkRepository } from '../../core/domain/repositories/spk.repository.interface';
import { SpkRepository as SpkRepositoryClass } from '../../infrastructure/database/typeorm/repositories/spk.repository';
import { CreateSpkStageUseCase, UpdateSpkStageUseCase } from '../../core/use-cases/spk';
import { ApprovalTransactionEntity } from '../../infrastructure/database/typeorm/entities/ApprovalTransaction.entity';
import { APPROVAL_REPOSITORY } from '../../core/domain/repositories/approval.repository.interface';
import { ApprovalRepository as ApprovalRepositoryClass } from '../../infrastructure/database/typeorm/repositories/approval.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SpkEntity,
      SpkDetailEntity,
      SpkBomEntity,
      BomItemEntity,
      SpkStageEntity,
      SpkStageHistoryEntity,
      ApprovalTransactionEntity,
    ]),
  ],
  controllers: [SpkStageController],
  providers: [
    SpkStageService,
    { provide: SPK_STAGE_REPOSITORY, useClass: SpkStageRepository },
    { provide: SPK_REPOSITORY, useClass: SpkRepositoryClass },
    { provide: APPROVAL_REPOSITORY, useClass: ApprovalRepositoryClass },
    {
      provide: CreateSpkStageUseCase,
      useFactory: (repo: SpkRepository) => new CreateSpkStageUseCase(repo),
      inject: [SPK_REPOSITORY],
    },
    {
      provide: UpdateSpkStageUseCase,
      useFactory: (repo: SpkRepository) => new UpdateSpkStageUseCase(repo),
      inject: [SPK_REPOSITORY],
    },
  ],
})
export class SpkStageModule {}