import { Article } from '../entities/article.entity';

export interface ArticleRepository {
  findById(id: string): Promise<Article | null>;
  findAll(): Promise<Article[]>;
  findAllPaginated(start: number, length: number): Promise<{ items: Article[]; total: number }>;
  create(entity: Article): Promise<Article>;
  update(entity: Article): Promise<Article>;
  delete(id: string): Promise<void>;
}

export const ARTICLE_REPOSITORY = Symbol('ArticleRepository');
