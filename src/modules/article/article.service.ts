import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArticleUseCase, UpdateArticleUseCase, FindAllArticleUseCase, FindArticleByIdUseCase, DeleteArticleUseCase } from 'src/core/use-cases/article';
import { Article } from '../../core/domain/entities/article.entity';
import type { CreateArticleDto } from './dto/create-article.dto';
import type { UpdateArticleDto } from './dto/update-article.dto';
import { randomUUID } from 'crypto';
import { tNotFound } from 'src/core/common/i18n/messages';

@Injectable()
export class ArticleService {
  constructor(
    private readonly createUseCase: CreateArticleUseCase,
    private readonly updateUseCase: UpdateArticleUseCase,
    private readonly findAllUseCase: FindAllArticleUseCase,
    private readonly findByIdUseCase: FindArticleByIdUseCase,
    private readonly deleteUseCase: DeleteArticleUseCase,
  ) {}

  private mapToResponse(entity: Article) {
    return {
      id: entity.id,
      article_name: entity.article_name,
      description: entity.description,
      is_active: entity.is_active,
      created_by: entity.created_by ?? null,
      created_dt: entity.created_dt ? entity.created_dt.toISOString() : null,
      changed_by: entity.changed_by ?? null,
      changed_dt: entity.changed_dt ? entity.changed_dt.toISOString() : null,
    };
  }

  async findAll(lang?: string) {
    const list = await this.findAllUseCase.execute();
    return list.map((e) => this.mapToResponse(e));
  }

  async findAllPaginated(start: number, length: number, lang?: string) {
    const { items, total } = await this.findAllUseCase.executePaginated(start, length);
    return { items: items.map((e) => this.mapToResponse(e)), total };
  }

  async findOne(id: string, lang?: string) {
    const entity = await this.findByIdUseCase.execute(id);
    if (!entity) {
      throw new NotFoundException(tNotFound('Article', lang));
    }
    return this.mapToResponse(entity);
  }

  async create(dto: CreateArticleDto, lang?: string) {
    const now = new Date();
    const creator = dto.user_id ?? 'system';
    const entity = new Article(
      randomUUID(),
      dto.article_name,
      dto.description ?? null,
      dto.is_active ?? true,
      creator,
      now,
      creator,
      now,
    );
    const saved = await this.createUseCase.execute(entity);
    return this.mapToResponse(saved);
  }

  async update(id: string, dto: UpdateArticleDto, lang?: string) {
    const existing = await this.findByIdUseCase.execute(id);
    if (!existing) {
      throw new NotFoundException(tNotFound('Article', lang));
    }
    const entity = new Article(
      id,
      dto.article_name ?? existing.article_name,
      dto.description ?? existing.description,
      dto.is_active ?? existing.is_active,
      existing.created_by,
      existing.created_dt,
      dto.user_id ?? existing.changed_by ?? 'system',
      new Date(),
    );
    const updated = await this.updateUseCase.execute(entity);
    return this.mapToResponse(updated);
  }

  async remove(id: string, lang?: string): Promise<void> {
    const existing = await this.findByIdUseCase.execute(id);
    if (!existing) {
      throw new NotFoundException(tNotFound('Article', lang));
    }
    await this.deleteUseCase.execute(id);
  }
}