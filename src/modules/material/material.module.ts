import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MaterialsController } from './material.controller';
import { MaterialsService } from './material.service';
import { CreateMaterialsUseCase, UpdateMaterialsUseCase, FindAllMaterialsUseCase, FindMaterialsByIdUseCase, DeleteMaterialsUseCase, FindMaterialsByBarcodeUseCase } from '../../core/use-cases/material';
import { MaterialsRepository, MATERIALS_REPOSITORY } from '../../core/domain/repositories/material.repository.interface';
import { MaterialsRepository as MaterialsRepositoryClass } from '../../infrastructure/database/typeorm/repositories/material.repository';
import { MaterialEntity } from '../../infrastructure/database/typeorm/entities/Material.entity';
import { SYSTEM_MASTER_REPOSITORY, SystemMasterRepository } from '../../core/domain/repositories/system-master.repository.interface';
import { SystemMasterRepository as SystemMasterRepositoryClass } from '../../infrastructure/database/typeorm/repositories/system-master.repository';
import { SystemMasterEntity } from '../../infrastructure/database/typeorm/entities/SystemMaster.entity';
import { FindSystemMasterByTypeCdUseCase } from '../../core/use-cases/system-master';


@Module({
  imports: [TypeOrmModule.forFeature([MaterialEntity, SystemMasterEntity])],
  controllers: [MaterialsController],
  providers: [
    MaterialsService,
    { provide: MATERIALS_REPOSITORY, useClass: MaterialsRepositoryClass },
    {
      provide: CreateMaterialsUseCase,
      useFactory: (repo: MaterialsRepository) => new CreateMaterialsUseCase(repo),
      inject: [MATERIALS_REPOSITORY],
    },
    {
      provide: UpdateMaterialsUseCase,
      useFactory: (repo: MaterialsRepository) => new UpdateMaterialsUseCase(repo),
      inject: [MATERIALS_REPOSITORY],
    },
    {
      provide: FindAllMaterialsUseCase,
      useFactory: (repo: MaterialsRepository) => new FindAllMaterialsUseCase(repo),
      inject: [MATERIALS_REPOSITORY],
    },
    {
      provide: FindMaterialsByIdUseCase,
      useFactory: (repo: MaterialsRepository) => new FindMaterialsByIdUseCase(repo),
      inject: [MATERIALS_REPOSITORY],
    },
    {
      provide: DeleteMaterialsUseCase,
      useFactory: (repo: MaterialsRepository) => new DeleteMaterialsUseCase(repo),
      inject: [MATERIALS_REPOSITORY],
    },
    {
      provide: FindMaterialsByBarcodeUseCase,
      useFactory: (repo: MaterialsRepository) => new FindMaterialsByBarcodeUseCase(repo),
      inject: [MATERIALS_REPOSITORY],
    },
    // System Master wiring for value lookups
    { provide: SYSTEM_MASTER_REPOSITORY, useClass: SystemMasterRepositoryClass },
    {
      provide: FindSystemMasterByTypeCdUseCase,
      useFactory: (repo: SystemMasterRepository) => new FindSystemMasterByTypeCdUseCase(repo),
      inject: [SYSTEM_MASTER_REPOSITORY],
    },
  ],
})
export class MaterialsModule {}