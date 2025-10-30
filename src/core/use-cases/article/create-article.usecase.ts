import { ArticleRepository } from '../../domain/repositories/article.repository.interface';
import { Article } from '../../domain/entities/article.entity';

export class CreateArticleUseCase {
  constructor(private readonly repo: ArticleRepository) {}

  async execute(entity: Article): Promise<Article> {
    return this.repo.create(entity);
  }
}