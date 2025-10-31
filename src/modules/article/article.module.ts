import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { CreateArticleUseCase, UpdateArticleUseCase, FindAllArticleUseCase, FindArticleByIdUseCase, DeleteArticleUseCase } from 'src/core/use-cases/article';
import { ArticleRepository, ARTICLE_REPOSITORY } from '../../core/domain/repositories/article.repository.interface';
import { ArticleRepository as ArticleRepositoryClass } from '../../infrastructure/database/typeorm/repositories/article.repository';
import { ArticleEntity } from '../../infrastructure/database/typeorm/entities/Article.entity';
import { ProductVariantEntity } from '../../infrastructure/database/typeorm/entities/ProductVariant.entity';
import { ProductVariantRepository, PRODUCT_VARIANT_REPOSITORY } from '../../core/domain/repositories/product-variant.repository.interface';
import { ProductVariantRepository as ProductVariantRepositoryClass } from '../../infrastructure/database/typeorm/repositories/product-variant.repository';
import { FindProductVariantsByArticleIdUseCase } from 'src/core/use-cases/product-variant/find-product-variants-by-article-id.usecase';


@Module({
  imports: [TypeOrmModule.forFeature([ArticleEntity, ProductVariantEntity])],
  controllers: [ArticleController],
  providers: [
    ArticleService,
    { provide: ARTICLE_REPOSITORY, useClass: ArticleRepositoryClass },
    {
      provide: CreateArticleUseCase,
      useFactory: (repo: ArticleRepository) => new CreateArticleUseCase(repo),
      inject: [ARTICLE_REPOSITORY],
    },
    {
      provide: UpdateArticleUseCase,
      useFactory: (repo: ArticleRepository) => new UpdateArticleUseCase(repo),
      inject: [ARTICLE_REPOSITORY],
    },
    {
      provide: FindAllArticleUseCase,
      useFactory: (repo: ArticleRepository) => new FindAllArticleUseCase(repo),
      inject: [ARTICLE_REPOSITORY],
    },
    {
      provide: FindArticleByIdUseCase,
      useFactory: (repo: ArticleRepository) => new FindArticleByIdUseCase(repo),
      inject: [ARTICLE_REPOSITORY],
    },
    {
      provide: DeleteArticleUseCase,
      useFactory: (repo: ArticleRepository) => new DeleteArticleUseCase(repo),
      inject: [ARTICLE_REPOSITORY],
    },
    // ProductVariant wiring for finding variants by article_id
    { provide: PRODUCT_VARIANT_REPOSITORY, useClass: ProductVariantRepositoryClass },
    {
      provide: FindProductVariantsByArticleIdUseCase,
      useFactory: (repo: ProductVariantRepository) => new FindProductVariantsByArticleIdUseCase(repo),
      inject: [PRODUCT_VARIANT_REPOSITORY],
    },
  ],
})
export class ArticleModule {}