import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductVariantEntity } from '../entities/ProductVariant.entity';
import type { ProductVariantRepository as ProductVariantRepositoryInterface } from '../../../../core/domain/repositories/product-variant.repository.interface';
import { ProductVariant } from '../../../../core/domain/entities/product-variant.entity';
import { ArticleEntity } from '../entities/Article.entity';

@Injectable()
export class ProductVariantRepository
  implements ProductVariantRepositoryInterface
{
  constructor(
    @InjectRepository(ProductVariantEntity)
    private readonly ormRepo: Repository<ProductVariantEntity>,
  ) {}

  async findAll(): Promise<ProductVariant[]> {
    const rows = await this.ormRepo.find({
      where: { is_active: true },
      relations: ['article'],
    });
    return rows.map((row) => this.mapToDomain(row));
  }

  async findById(id: string): Promise<ProductVariant | null> {
    const row = await this.ormRepo.findOne({
      where: { id, is_active: true },
      relations: ['article'],
    });
    return row ? this.mapToDomain(row) : null;
  }

  async findByBarcode(barcode: string): Promise<ProductVariant | null> {
    const row = await this.ormRepo.findOne({
      where: { barcode },
      relations: ['article'],
    });
    return row ? this.mapToDomain(row) : null;
  }

  async findByArticleId(articleId: string): Promise<ProductVariant[]> {
    const rows = await this.ormRepo.find({
      where: { 
        article: { id: articleId },
        is_active: true 
      },
      relations: ['article'],
    });
    return rows.map((row) => this.mapToDomain(row));
  }

  async create(entity: ProductVariant): Promise<ProductVariant> {
    const row = this.mapToOrm(entity);
    const saved = await this.ormRepo.save(row);
    return this.mapToDomain(saved);
  }

  async update(entity: ProductVariant): Promise<ProductVariant> {
    const saved = await this.ormRepo.save(this.mapToOrm(entity));
    return this.mapToDomain(saved);
  }

  async delete(id: string): Promise<void> {
    await this.ormRepo.delete({ id });
  }

  private mapToDomain(row: ProductVariantEntity): ProductVariant {
    return new ProductVariant(
      row.id,
      row.article ? (row.article as ArticleEntity).id : '',
      row.product_name,
      row.size,
      row.color ?? null,
      row.barcode ?? null,
      row.sku ?? null,
      Number(row.price),
      Number(row.cost_price),
      row.is_active,
      row.created_by,
      row.created_dt,
      row.changed_by,
      row.changed_dt,
    );
  }

  private mapToOrm(entity: ProductVariant): ProductVariantEntity {
    const row = new ProductVariantEntity();
    if (entity.id) {
      // Only set id if provided; otherwise let DB generate
      (row as any).id = entity.id;
    }
    row.article = { id: entity.article_id } as ArticleEntity;
    row.product_name = entity.product_name;
    row.size = entity.size;
    row.color = entity.color ?? (null as any);
    row.barcode = entity.barcode ?? (null as any);
    row.sku = entity.sku ?? (null as any);
    row.price = entity.price;
    row.cost_price = entity.cost_price;
    row.is_active = entity.is_active;
    row.created_by = entity.created_by;
    row.created_dt = entity.created_dt;
    row.changed_by = entity.changed_by;
    row.changed_dt = entity.changed_dt;
    return row;
  }
}
