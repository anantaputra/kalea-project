import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { CreateArticleUseCase, UpdateArticleUseCase, FindAllArticleUseCase, FindArticleByIdUseCase, DeleteArticleUseCase } from 'src/core/use-cases/article';
import { ArticleRepository, ARTICLE_REPOSITORY } from '../../core/domain/repositories/article.repository.interface';
import { ArticleRepository as ArticleRepositoryClass } from '../../infrastructure/database/typeorm/repositories/article.repository';
import { ArticleEntity } from '../../infrastructure/database/typeorm/entities/Article.entity';


@Module({
  imports: [TypeOrmModule.forFeature([ArticleEntity])],
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
  ],
})
export class ArticleModule {}