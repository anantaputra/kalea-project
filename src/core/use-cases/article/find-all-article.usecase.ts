import { ArticleRepository } from '../../domain/repositories/article.repository.interface';
import { Article } from '../../domain/entities/article.entity';

export class FindAllArticleUseCase {
  constructor(private readonly repo: ArticleRepository) {}

  async execute(): Promise<Article[]> {
    return this.repo.findAll();
  }

  async executePaginated(
    start: number,
    length: number,
  ): Promise<{ items: Article[]; total: number }> {
    return this.repo.findAllPaginated(start, length);
  }
}
