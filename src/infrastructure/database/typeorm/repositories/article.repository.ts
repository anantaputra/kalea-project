import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArticleEntity } from '../entities/Article.entity';
import type { ArticleRepository as ArticleRepositoryInterface } from '../../../../core/domain/repositories/article.repository.interface';
import { Article } from '../../../../core/domain/entities/article.entity';

@Injectable()
export class ArticleRepository implements ArticleRepositoryInterface {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly ormRepo: Repository<ArticleEntity>,
  ) {}

  async findAll(): Promise<Article[]> {
    const rows = await this.ormRepo.find({ where: { is_active: true } });
    return rows.map((row) => this.mapToDomain(row));
  }

  async findAllPaginated(
    start: number,
    length: number,
  ): Promise<{ items: Article[]; total: number }> {
    const [rows, total] = await this.ormRepo.findAndCount({
      where: { is_active: true },
      skip: start,
      take: length,
      order: { created_dt: 'DESC' },
    });
    return { items: rows.map((row) => this.mapToDomain(row)), total };
  }

  async findById(id: string): Promise<Article | null> {
    const row = await this.ormRepo.findOne({ where: { id, is_active: true } });
    return row ? this.mapToDomain(row) : null;
  }

  async create(entity: Article): Promise<Article> {
    const row = this.mapToOrm(entity);
    const saved = await this.ormRepo.save(row);
    return this.mapToDomain(saved);
  }

  async update(entity: Article): Promise<Article> {
    const saved = await this.ormRepo.save(this.mapToOrm(entity));
    return this.mapToDomain(saved);
  }

  async delete(id: string): Promise<void> {
    await this.ormRepo.delete({ id });
  }

  private mapToDomain(row: ArticleEntity): Article {
    return new Article(
      row.id,
      row.article_name,
      row.description ?? null,
      row.is_active,
      row.created_by,
      row.created_dt,
      row.changed_by ?? 'system',
      row.changed_dt ?? row.created_dt,
    );
  }

  private mapToOrm(entity: Article): ArticleEntity {
    const row = new ArticleEntity();
    row.id = entity.id;
    row.article_name = entity.article_name;
    row.description = entity.description ?? null;
    row.is_active = entity.is_active;
    row.created_by = entity.created_by;
    row.created_dt = entity.created_dt;
    row.changed_by = entity.changed_by;
    row.changed_dt = entity.changed_dt;
    return row;
  }
}
