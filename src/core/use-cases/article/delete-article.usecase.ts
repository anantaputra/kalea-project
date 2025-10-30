import { ArticleRepository } from '../../domain/repositories/article.repository.interface';

export class DeleteArticleUseCase {
  constructor(private readonly repo: ArticleRepository) {}

  async execute(id: string): Promise<void> {
    return this.repo.delete(id);
  }
}
