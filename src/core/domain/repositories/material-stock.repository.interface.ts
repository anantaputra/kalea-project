import { MaterialStock } from '../entities/material-stock.entity';

export interface MaterialStockRepository {
  findById(id: string): Promise<MaterialStock | null>;
  findAll(): Promise<MaterialStock[]>;
  create(entity: MaterialStock): Promise<MaterialStock>;
  update(entity: MaterialStock): Promise<MaterialStock>;
  delete(id: string): Promise<void>;
}

export const MATERIAL_STOCK_REPOSITORY = Symbol('MaterialStockRepository');