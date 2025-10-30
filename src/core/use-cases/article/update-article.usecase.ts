import { ArticleRepository } from '../../domain/repositories/article.repository.interface';
import { Article } from '../../domain/entities/article.entity';

export class UpdateArticleUseCase {
  constructor(private readonly repo: ArticleRepository) {}

  async execute(entity: Article): Promise<Article> {
    return this.repo.update(entity);
  }
}