import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliveryNoteController } from './delivery-note.controller';
import { DeliveryNoteService } from './delivery-note.service';
import { CreateDeliveryNoteUseCase, UpdateDeliveryNoteUseCase, ApproveDeliveryNoteUseCase, CreateDeliveryNoteFullUseCase, FindDeliveryNoteFullByIdUseCase, UpdateDeliveryNoteFullUseCase } from 'src/core/use-cases/delivery-note';
import { DeliveryNoteRepository, DELIVERY_NOTE_REPOSITORY } from '../../core/domain/repositories/delivery-note.repository.interface';
import { DeliveryNoteRepository as DeliveryNoteRepositoryClass } from '../../infrastructure/database/typeorm/repositories/delivery-note.repository';
import { ApprovalRepository as ApprovalRepositoryClass } from '../../infrastructure/database/typeorm/repositories/approval.repository';
import { APPROVAL_REPOSITORY, ApprovalRepository as ApprovalRepositoryInterface } from '../../core/domain/repositories/approval.repository.interface';
import { DeliveryNoteEntity } from '../../infrastructure/database/typeorm/entities/DeliveryNote.entity';
import { DeliveryNoteDetailEntity } from '../../infrastructure/database/typeorm/entities/DeliveryNoteDetail.entity';
import { VendorEntity } from '../../infrastructure/database/typeorm/entities/Vendor.entity';
import { SpkDetailEntity } from '../../infrastructure/database/typeorm/entities/SpkDetail.entity';
import { SpkEntity } from '../../infrastructure/database/typeorm/entities/Spk.entity';
import { ApprovalTransactionEntity } from '../../infrastructure/database/typeorm/entities/ApprovalTransaction.entity';
import { SystemMasterEntity } from 'src/infrastructure/database/typeorm/entities/SystemMaster.entity';
import { SystemMasterService } from '../system-master/system-master.service';
import { SYSTEM_MASTER_REPOSITORY, SystemMasterRepository } from 'src/core/domain/repositories/system-master.repository.interface';
import { CreateSystemMasterUseCase, UpdateSystemMasterUseCase, FindSystemMasterByTypeUseCase, FindSystemMasterByTypeCdUseCase, DeleteSystemMasterUseCase, FindSystemMasterByTypePaginatedUseCase } from 'src/core/use-cases/system-master';
import { SystemMasterRepository as SystemMasterRepositoryClass } from '../../infrastructure/database/typeorm/repositories/system-master.repository';


@Module({
  imports: [
    TypeOrmModule.forFeature([
      DeliveryNoteEntity,
      DeliveryNoteDetailEntity,
      VendorEntity,
      SpkDetailEntity,
      SpkEntity,
      ApprovalTransactionEntity,
      SystemMasterEntity,
    ]),
  ],
  controllers: [DeliveryNoteController],
  providers: [
    DeliveryNoteService,
    SystemMasterService,
    { provide: DELIVERY_NOTE_REPOSITORY, useClass: DeliveryNoteRepositoryClass },
    { provide: APPROVAL_REPOSITORY, useClass: ApprovalRepositoryClass },
    {
      provide: CreateDeliveryNoteUseCase,
      useFactory: (repo: DeliveryNoteRepository) => new CreateDeliveryNoteUseCase(repo),
      inject: [DELIVERY_NOTE_REPOSITORY],
    },
    {
      provide: UpdateDeliveryNoteUseCase,
      useFactory: (repo: DeliveryNoteRepository) => new UpdateDeliveryNoteUseCase(repo),
      inject: [DELIVERY_NOTE_REPOSITORY],
    },
    {
      provide: CreateDeliveryNoteFullUseCase,
      useFactory: (repo: DeliveryNoteRepository) => new CreateDeliveryNoteFullUseCase(repo),
      inject: [DELIVERY_NOTE_REPOSITORY],
    },
    {
      provide: FindDeliveryNoteFullByIdUseCase,
      useFactory: (repo: DeliveryNoteRepository) => new FindDeliveryNoteFullByIdUseCase(repo),
      inject: [DELIVERY_NOTE_REPOSITORY],
    },
    {
      provide: UpdateDeliveryNoteFullUseCase,
      useFactory: (repo: DeliveryNoteRepository) => new UpdateDeliveryNoteFullUseCase(repo),
      inject: [DELIVERY_NOTE_REPOSITORY],
    },
    {
      provide: ApproveDeliveryNoteUseCase,
      useFactory: (
        approvalRepo: ApprovalRepositoryInterface,
        dnRepo: DeliveryNoteRepository,
      ) => new ApproveDeliveryNoteUseCase(approvalRepo, dnRepo),
      inject: [APPROVAL_REPOSITORY, DELIVERY_NOTE_REPOSITORY],
    },
    // Bind repository token to TypeORM implementation
    {
      provide: SYSTEM_MASTER_REPOSITORY,
      useClass: SystemMasterRepositoryClass,
    },
    // Use cases wired via factory to the repository
    {
      provide: CreateSystemMasterUseCase,
      useFactory: (repo: SystemMasterRepository) =>
        new CreateSystemMasterUseCase(repo),
      inject: [SYSTEM_MASTER_REPOSITORY],
    },
    {
      provide: UpdateSystemMasterUseCase,
      useFactory: (repo: SystemMasterRepository) =>
        new UpdateSystemMasterUseCase(repo),
      inject: [SYSTEM_MASTER_REPOSITORY],
    },
    {
      provide: FindSystemMasterByTypeUseCase,
      useFactory: (repo: SystemMasterRepository) =>
        new FindSystemMasterByTypeUseCase(repo),
      inject: [SYSTEM_MASTER_REPOSITORY],
    },
    {
      provide: FindSystemMasterByTypeCdUseCase,
      useFactory: (repo: SystemMasterRepository) =>
        new FindSystemMasterByTypeCdUseCase(repo),
      inject: [SYSTEM_MASTER_REPOSITORY],
    },
    {
      provide: DeleteSystemMasterUseCase,
      useFactory: (repo: SystemMasterRepository) =>
        new DeleteSystemMasterUseCase(repo),
      inject: [SYSTEM_MASTER_REPOSITORY],
    },
    {
      provide: FindSystemMasterByTypePaginatedUseCase,
      useFactory: (repo: SystemMasterRepository) =>
        new FindSystemMasterByTypePaginatedUseCase(repo),
      inject: [SYSTEM_MASTER_REPOSITORY],
    },
  ],
})
export class DeliveryNoteModule {}