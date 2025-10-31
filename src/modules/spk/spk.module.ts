import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpkController } from './spk.controller';
import { SpkService } from './spk.service';
import {
  CreateSpkUseCase,
  UpdateSpkUseCase,
  FindAllSpkUseCase,
  FindSpkFullByIdUseCase,
  CreateSpkFullUseCase,
  UpdateSpkFullUseCase,
  ApproveSpkUseCase,
} from 'src/core/use-cases/spk';
import { SpkRepository, SPK_REPOSITORY } from '../../core/domain/repositories/spk.repository.interface';
import { SpkRepository as SpkRepositoryClass } from '../../infrastructure/database/typeorm/repositories/spk.repository';
import { SpkEntity } from '../../infrastructure/database/typeorm/entities/Spk.entity';
import { SpkDetailEntity } from '../../infrastructure/database/typeorm/entities/SpkDetail.entity';
import { SpkBomEntity } from '../../infrastructure/database/typeorm/entities/SpkBom.entity';
import { BomItemEntity } from '../../infrastructure/database/typeorm/entities/BomItem.entity';
import { SpkStageEntity } from '../../infrastructure/database/typeorm/entities/SpkStage.entity';
import { ProductVariantEntity } from '../../infrastructure/database/typeorm/entities/ProductVariant.entity';
import { MaterialEntity } from '../../infrastructure/database/typeorm/entities/Material.entity';
import { ApprovalTransactionEntity } from '../../infrastructure/database/typeorm/entities/ApprovalTransaction.entity';
import { ApprovalRepository as ApprovalRepositoryClass } from '../../infrastructure/database/typeorm/repositories/approval.repository';
import { APPROVAL_REPOSITORY, ApprovalRepository as ApprovalRepositoryInterface } from '../../core/domain/repositories/approval.repository.interface';
import { SystemMasterEntity } from '../../infrastructure/database/typeorm/entities/SystemMaster.entity';
import { SYSTEM_MASTER_REPOSITORY, SystemMasterRepository } from '../../core/domain/repositories/system-master.repository.interface';
import { SystemMasterRepository as SystemMasterRepositoryClass } from '../../infrastructure/database/typeorm/repositories/system-master.repository';
import { FindSystemMasterByTypeCdUseCase } from '../../core/use-cases/system-master';


@Module({
  imports: [
    TypeOrmModule.forFeature([
      SpkEntity,
      SpkDetailEntity,
      SpkBomEntity,
      BomItemEntity,
      SpkStageEntity,
      ProductVariantEntity,
      MaterialEntity,
      ApprovalTransactionEntity,
      SystemMasterEntity,
    ]),
  ],
  controllers: [SpkController],
  providers: [
    SpkService,
    { provide: SPK_REPOSITORY, useClass: SpkRepositoryClass },
    { provide: APPROVAL_REPOSITORY, useClass: ApprovalRepositoryClass },
    // System Master wiring for UOM lookups
    { provide: SYSTEM_MASTER_REPOSITORY, useClass: SystemMasterRepositoryClass },
    {
      provide: FindSystemMasterByTypeCdUseCase,
      useFactory: (repo: SystemMasterRepository) => new FindSystemMasterByTypeCdUseCase(repo),
      inject: [SYSTEM_MASTER_REPOSITORY],
    },
    {
      provide: CreateSpkUseCase,
      useFactory: (repo: SpkRepository) => new CreateSpkUseCase(repo),
      inject: [SPK_REPOSITORY],
    },
    {
      provide: UpdateSpkUseCase,
      useFactory: (repo: SpkRepository) => new UpdateSpkUseCase(repo),
      inject: [SPK_REPOSITORY],
    },
    {
      provide: FindAllSpkUseCase,
      useFactory: (repo: SpkRepository) => new FindAllSpkUseCase(repo),
      inject: [SPK_REPOSITORY],
    },
    {
      provide: FindSpkFullByIdUseCase,
      useFactory: (repo: SpkRepository) => new FindSpkFullByIdUseCase(repo),
      inject: [SPK_REPOSITORY],
    },
    {
      provide: CreateSpkFullUseCase,
      useFactory: (repo: SpkRepository) => new CreateSpkFullUseCase(repo),
      inject: [SPK_REPOSITORY],
    },
    {
      provide: UpdateSpkFullUseCase,
      useFactory: (repo: SpkRepository) => new UpdateSpkFullUseCase(repo),
      inject: [SPK_REPOSITORY],
    },
    {
      provide: ApproveSpkUseCase,
      useFactory: (
        approvalRepo: ApprovalRepositoryInterface,
        spkRepo: SpkRepository,
      ) => new ApproveSpkUseCase(approvalRepo, spkRepo),
      inject: [APPROVAL_REPOSITORY, SPK_REPOSITORY],
    },
  ],
})
export class SpkModule {}