import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MaterialStockController } from './material-stock.controller';
import { MaterialStockService } from './material-stock.service';
import { CreateMaterialStockUseCase, UpdateMaterialStockUseCase, DeleteMaterialStockUseCase, ApproveMaterialStockUseCase } from '../../core/use-cases/material-stock';
import { MaterialStockRepository, MATERIAL_STOCK_REPOSITORY } from '../../core/domain/repositories/material-stock.repository.interface';
import { MaterialsRepository, MATERIALS_REPOSITORY } from '../../core/domain/repositories/material.repository.interface';
import { MaterialStockRepository as MaterialStockRepositoryClass } from '../../infrastructure/database/typeorm/repositories/material-stock.repository';
import { MaterialsRepository as MaterialsRepositoryClass } from '../../infrastructure/database/typeorm/repositories/material.repository';
import { MaterialStockEntity } from '../../infrastructure/database/typeorm/entities/MaterialStock.entity';
import { MaterialEntity } from '../../infrastructure/database/typeorm/entities/Material.entity';
import { ApprovalTransactionEntity } from '../../infrastructure/database/typeorm/entities/ApprovalTransaction.entity';
import { ApprovalRepository as ApprovalRepositoryClass } from '../../infrastructure/database/typeorm/repositories/approval.repository';
import { APPROVAL_REPOSITORY, ApprovalRepository as ApprovalRepositoryInterface } from '../../core/domain/repositories/approval.repository.interface';


@Module({
  imports: [TypeOrmModule.forFeature([MaterialStockEntity, MaterialEntity, ApprovalTransactionEntity])],
  controllers: [MaterialStockController],
  providers: [
    MaterialStockService,
    { provide: MATERIAL_STOCK_REPOSITORY, useClass: MaterialStockRepositoryClass },
    { provide: MATERIALS_REPOSITORY, useClass: MaterialsRepositoryClass },
    { provide: APPROVAL_REPOSITORY, useClass: ApprovalRepositoryClass },
    {
      provide: CreateMaterialStockUseCase,
      useFactory: (repo: MaterialStockRepository) => new CreateMaterialStockUseCase(repo),
      inject: [MATERIAL_STOCK_REPOSITORY],
    },
    {
      provide: UpdateMaterialStockUseCase,
      useFactory: (repo: MaterialStockRepository) => new UpdateMaterialStockUseCase(repo),
      inject: [MATERIAL_STOCK_REPOSITORY],
    },
    {
      provide: DeleteMaterialStockUseCase,
      useFactory: (repo: MaterialStockRepository) => new DeleteMaterialStockUseCase(repo),
      inject: [MATERIAL_STOCK_REPOSITORY],
    },
    {
      provide: ApproveMaterialStockUseCase,
      useFactory: (
        approvalRepo: ApprovalRepositoryInterface,
        msRepo: MaterialStockRepository,
        materialsRepo: MaterialsRepository,
      ) => new ApproveMaterialStockUseCase(approvalRepo, msRepo, materialsRepo),
      inject: [APPROVAL_REPOSITORY, MATERIAL_STOCK_REPOSITORY, MATERIALS_REPOSITORY],
    },
  ],
})
export class MaterialStockModule {}