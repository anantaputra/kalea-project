import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BomItemController } from './bom-item.controller';
import { BomItemService } from './bom-item.service';
import { CreateBomItemUseCase, UpdateBomItemUseCase } from 'src/core/use-cases/bom-item';
import { FindAllBomItemUseCase } from '../../core/use-cases/bom-item/find-all-bom-item.usecase';
import { FindBomItemByIdUseCase } from '../../core/use-cases/bom-item/find-bom-item-by-id.usecase';
import { DeleteBomItemUseCase } from '../../core/use-cases/bom-item/delete-bom-item.usecase';
import { FindBomItemsByProductVariantIdUseCase } from '../../core/use-cases/bom-item/find-bom-items-by-product-variant-id.usecase';
import { BomItemRepository, BOM_ITEM_REPOSITORY } from '../../core/domain/repositories/bom-item.repository.interface';
import { BomItemRepository as BomItemRepositoryClass } from '../../infrastructure/database/typeorm/repositories/bom-item.repository';
import { BomItemEntity } from '../../infrastructure/database/typeorm/entities/BomItem.entity';


@Module({
  imports: [TypeOrmModule.forFeature([BomItemEntity])],
  controllers: [BomItemController],
  providers: [
    BomItemService,
    { provide: BOM_ITEM_REPOSITORY, useClass: BomItemRepositoryClass },
    {
      provide: CreateBomItemUseCase,
      useFactory: (repo: BomItemRepository) => new CreateBomItemUseCase(repo),
      inject: [BOM_ITEM_REPOSITORY],
    },
    {
      provide: UpdateBomItemUseCase,
      useFactory: (repo: BomItemRepository) => new UpdateBomItemUseCase(repo),
      inject: [BOM_ITEM_REPOSITORY],
    },
    {
      provide: FindAllBomItemUseCase,
      useFactory: (repo: BomItemRepository) => new FindAllBomItemUseCase(repo),
      inject: [BOM_ITEM_REPOSITORY],
    },
    {
      provide: FindBomItemByIdUseCase,
      useFactory: (repo: BomItemRepository) => new FindBomItemByIdUseCase(repo),
      inject: [BOM_ITEM_REPOSITORY],
    },
    {
      provide: DeleteBomItemUseCase,
      useFactory: (repo: BomItemRepository) => new DeleteBomItemUseCase(repo),
      inject: [BOM_ITEM_REPOSITORY],
    },
    {
      provide: FindBomItemsByProductVariantIdUseCase,
      useFactory: (repo: BomItemRepository) => new FindBomItemsByProductVariantIdUseCase(repo),
      inject: [BOM_ITEM_REPOSITORY],
    },
  ],
})
export class BomItemModule {}