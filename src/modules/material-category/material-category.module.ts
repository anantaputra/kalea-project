import { Module } from '@nestjs/common';
import { MaterialCategoryController } from './material-category.controller';
import { MaterialCategoryService } from './material-category.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SYSTEM_MASTER_REPOSITORY, SystemMasterRepository } from 'src/core/domain/repositories/system-master.repository.interface';
import { CreateSystemMasterUseCase, UpdateSystemMasterUseCase, FindSystemMasterByTypeUseCase, FindSystemMasterByTypeCdUseCase, DeleteSystemMasterUseCase, FindSystemMasterByTypePaginatedUseCase } from 'src/core/use-cases/system-master';
import { SystemMasterEntity } from 'src/infrastructure/database/typeorm/entities/SystemMaster.entity';
import { SystemMasterService } from '../system-master/system-master.service';
import { SystemMasterRepository as SystemMasterRepositoryClass } from '../../infrastructure/database/typeorm/repositories/system-master.repository';


@Module({
  imports: [TypeOrmModule.forFeature([SystemMasterEntity])],
  controllers: [MaterialCategoryController],
  providers: [
    MaterialCategoryService,
    SystemMasterService,
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
export class MaterialCategoryModule {}