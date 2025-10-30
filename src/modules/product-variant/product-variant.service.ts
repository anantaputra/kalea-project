import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductVariantUseCase, UpdateProductVariantUseCase, FindAllProductVariantUseCase, FindProductVariantByIdUseCase, DeleteProductVariantUseCase, FindProductVariantByBarcodeUseCase } from 'src/core/use-cases/product-variant';
import { FindArticleByIdUseCase } from '../../core/use-cases/article';
import { ProductVariant } from '../../core/domain/entities/product-variant.entity';
import { randomUUID } from 'crypto';
import bwipjs from 'bwip-js';
import { tNotFound } from 'src/core/common/i18n/messages';

@Injectable()
export class ProductVariantService {
  constructor(
    private readonly createUseCase: CreateProductVariantUseCase,
    private readonly updateUseCase: UpdateProductVariantUseCase,
    private readonly findAllUseCase: FindAllProductVariantUseCase,
    private readonly findByIdUseCase: FindProductVariantByIdUseCase,
    private readonly deleteUseCase: DeleteProductVariantUseCase,
    private readonly findByBarcodeUseCase: FindProductVariantByBarcodeUseCase,
    private readonly findArticleByIdUseCase: FindArticleByIdUseCase,
  ) {}

  private async mapToResponse(entity: ProductVariant) {
    const article = await this.findArticleByIdUseCase.execute(entity.article_id);
    return {
      id: entity.id,
      article: article
        ? {
            id: article.id,
            article_name: article.article_name,
            description: article.description,
          }
        : { id: entity.article_id },
      product_name: entity.product_name,
      size: entity.size,
      color: entity.color,
      barcode: entity.barcode,
      sku: entity.sku,
      price: entity.price.toFixed(2),
      cost_price: entity.cost_price.toFixed(2),
      is_active: entity.is_active,
      created_by: entity.created_by ?? null,
      created_dt: entity.created_dt ? entity.created_dt.toISOString() : null,
      changed_by: entity.changed_by ?? null,
      changed_dt: entity.changed_dt ? entity.changed_dt.toISOString() : null,
    };
  }

  async findAll(lang?: string) {
    const list = await this.findAllUseCase.execute();
    const mapped = await Promise.all(list.map((e) => this.mapToResponse(e)));
    return mapped;
  }

  async findAllPaginated(start: number, length: number, lang?: string) {
    // Repository belum dukung paginasi; lakukan slicing manual
    const list = await this.findAllUseCase.execute();
    const total = list.length;
    const slice = list.slice(start, start + length);
    const mapped = await Promise.all(slice.map((e) => this.mapToResponse(e)));
    return { items: mapped, total };
  }

  async findOne(id: string, lang?: string) {
    const entity = await this.findByIdUseCase.execute(id);
    if (!entity) {
      throw new NotFoundException(tNotFound('Product Variant', lang));
    }
    return this.mapToResponse(entity);
  }

  async create(dto: any, lang?: string) {
    const now = new Date();
    const creator = dto.user_id ?? 'system';
    const barcode = await this.generateUniqueBarcode();
    const entity = new ProductVariant(
      randomUUID(),
      dto.article_id,
      dto.product_name,
      dto.size,
      dto.color ?? null,
      barcode,
      dto.sku ?? null,
      dto.price,
      dto.cost_price,
      dto.is_active ?? true,
      creator,
      now,
      creator,
      now,
    );
    const saved = await this.createUseCase.execute(entity);
    return this.mapToResponse(saved);
  }

  async update(id: string, dto: any, lang?: string) {
    const existing = await this.findByIdUseCase.execute(id);
    if (!existing) {
      throw new NotFoundException(tNotFound('Product Variant', lang));
    }
    const entity = new ProductVariant(
      id,
      dto.article_id ?? existing.article_id,
      dto.product_name ?? existing.product_name,
      dto.size ?? existing.size,
      dto.color ?? existing.color,
      existing.barcode, // barcode tidak diubah saat update
      dto.sku ?? existing.sku,
      dto.price ?? existing.price,
      dto.cost_price ?? existing.cost_price,
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
      throw new NotFoundException(tNotFound('Product Variant', lang));
    }
    await this.deleteUseCase.execute(id);
  }

  // --- Barcode generation helpers (EAN-13) ---
  private async generateUniqueBarcode(): Promise<string> {
    for (let i = 0; i < 100; i++) {
      const base12 = this.random12Digits();
      const check = this.computeEan13CheckDigit(base12);
      const candidate = `${base12}${check}`;

      const existing = await this.findByBarcodeUseCase.execute(candidate);
      if (existing) continue;

      const ok = await this.renderWithBwip(candidate);
      if (!ok) continue;

      return candidate;
    }
    const base = `${Date.now()}`.slice(0, 12).padEnd(12, '0');
    return `${base}${this.computeEan13CheckDigit(base)}`;
  }

  private computeEan13CheckDigit(d12: string): number {
    const digits = d12.split('').map((d) => parseInt(d, 10));
    const sum = digits.reduce((acc, val, idx) => {
      const pos = idx + 1; // 1-indexed
      return acc + (pos % 2 === 0 ? val * 3 : val);
    }, 0);
    return (10 - (sum % 10)) % 10;
  }

  private random12Digits(): string {
    let s = '';
    for (let i = 0; i < 12; i++) {
      s += Math.floor(Math.random() * 10).toString();
    }
    return s;
  }

  private async renderWithBwip(text: string): Promise<boolean> {
    try {
      await bwipjs.toBuffer({
        bcid: 'ean13',
        text,
        scale: 3,
        height: 10,
        includetext: true,
        textxalign: 'center',
      });
      return true;
    } catch {
      return false;
    }
  }
}