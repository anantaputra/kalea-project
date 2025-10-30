import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemMasterController } from './system-master.controller';
import { SystemMasterService } from './system-master.service';
import {
  CreateSystemMasterUseCase,
  UpdateSystemMasterUseCase,
  FindSystemMasterByTypeUseCase,
  FindSystemMasterByTypeCdUseCase,
  DeleteSystemMasterUseCase,
  FindSystemMasterByTypePaginatedUseCase,
} from '../../core/use-cases/system-master';
import {
  SystemMasterRepository,
  SYSTEM_MASTER_REPOSITORY,
} from '../../core/domain/repositories/system-master.repository.interface';
import { SystemMasterRepository as SystemMasterRepositoryClass } from '../../infrastructure/database/typeorm/repositories/system-master.repository';
import { SystemMasterEntity } from '../../infrastructure/database/typeorm/entities/SystemMaster.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SystemMasterEntity])],
  controllers: [SystemMasterController],
  providers: [
    SystemMasterService,
    {
      provide: SYSTEM_MASTER_REPOSITORY,
      useClass: SystemMasterRepositoryClass,
    },
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
export class SystemMasterModule {}
