import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductVariantController } from './product-variant.controller';
import { ProductVariantService } from './product-variant.service';
import { CreateProductVariantUseCase, UpdateProductVariantUseCase, FindAllProductVariantUseCase, FindProductVariantByIdUseCase, DeleteProductVariantUseCase, FindProductVariantByBarcodeUseCase } from 'src/core/use-cases/product-variant';
import { ProductVariantRepository, PRODUCT_VARIANT_REPOSITORY } from '../../core/domain/repositories/product-variant.repository.interface';
import { ProductVariantRepository as ProductVariantRepositoryClass } from '../../infrastructure/database/typeorm/repositories/product-variant.repository';
import { ProductVariantEntity } from '../../infrastructure/database/typeorm/entities/ProductVariant.entity';
import { ArticleEntity } from '../../infrastructure/database/typeorm/entities/Article.entity';
import { ARTICLE_REPOSITORY, ArticleRepository } from '../../core/domain/repositories/article.repository.interface';
import { ArticleRepository as ArticleRepositoryClass } from '../../infrastructure/database/typeorm/repositories/article.repository';
import { FindArticleByIdUseCase } from '../../core/use-cases/article';
import { BomItemModule } from '../bom-item/bom-item.module';
import { SYSTEM_MASTER_REPOSITORY, SystemMasterRepository } from '../../core/domain/repositories/system-master.repository.interface';
import { SystemMasterRepository as SystemMasterRepositoryClass } from '../../infrastructure/database/typeorm/repositories/system-master.repository';
import { SystemMasterEntity } from '../../infrastructure/database/typeorm/entities/SystemMaster.entity';
import { FindSystemMasterByTypeCdUseCase } from '../../core/use-cases/system-master';


@Module({
  imports: [TypeOrmModule.forFeature([ProductVariantEntity, ArticleEntity, SystemMasterEntity]), BomItemModule],
  controllers: [ProductVariantController],
  providers: [
    ProductVariantService,
    { provide: PRODUCT_VARIANT_REPOSITORY, useClass: ProductVariantRepositoryClass },
    {
      provide: CreateProductVariantUseCase,
      useFactory: (repo: ProductVariantRepository) => new CreateProductVariantUseCase(repo),
      inject: [PRODUCT_VARIANT_REPOSITORY],
    },
    {
      provide: UpdateProductVariantUseCase,
      useFactory: (repo: ProductVariantRepository) => new UpdateProductVariantUseCase(repo),
      inject: [PRODUCT_VARIANT_REPOSITORY],
    },
    {
      provide: FindAllProductVariantUseCase,
      useFactory: (repo: ProductVariantRepository) => new FindAllProductVariantUseCase(repo),
      inject: [PRODUCT_VARIANT_REPOSITORY],
    },
    {
      provide: FindProductVariantByIdUseCase,
      useFactory: (repo: ProductVariantRepository) => new FindProductVariantByIdUseCase(repo),
      inject: [PRODUCT_VARIANT_REPOSITORY],
    },
    {
      provide: DeleteProductVariantUseCase,
      useFactory: (repo: ProductVariantRepository) => new DeleteProductVariantUseCase(repo),
      inject: [PRODUCT_VARIANT_REPOSITORY],
    },
    {
      provide: FindProductVariantByBarcodeUseCase,
      useFactory: (repo: ProductVariantRepository) => new FindProductVariantByBarcodeUseCase(repo),
      inject: [PRODUCT_VARIANT_REPOSITORY],
    },
    // Article wiring for enrichment in service
    { provide: ARTICLE_REPOSITORY, useClass: ArticleRepositoryClass },
    {
      provide: FindArticleByIdUseCase,
      useFactory: (repo: ArticleRepository) => new FindArticleByIdUseCase(repo),
      inject: [ARTICLE_REPOSITORY],
    },
    // System Master wiring for resolving material_category & unit_of_measure values
    { provide: SYSTEM_MASTER_REPOSITORY, useClass: SystemMasterRepositoryClass },
    {
      provide: FindSystemMasterByTypeCdUseCase,
      useFactory: (repo: SystemMasterRepository) => new FindSystemMasterByTypeCdUseCase(repo),
      inject: [SYSTEM_MASTER_REPOSITORY],
    },
  ],
})
export class ProductVariantModule {}