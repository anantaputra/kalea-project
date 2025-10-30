import { ArticleRepository } from '../../domain/repositories/article.repository.interface';
import { Article } from '../../domain/entities/article.entity';

export class FindArticleByIdUseCase {
  constructor(private readonly repo: ArticleRepository) {}

  async execute(id: string): Promise<Article | null> {
    return this.repo.findById(id);
  }
}
