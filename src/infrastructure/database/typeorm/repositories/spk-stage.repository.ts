import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SpkStageEntity } from '../entities/SpkStage.entity';
import type { SpkStageRepository as SpkStageRepositoryInterface } from '../../../../core/domain/repositories/spk-stage.repository.interface';
import { SpkStage } from '../../../../core/domain/entities/spk-stage.entity';

@Injectable()
export class SpkStageRepository implements SpkStageRepositoryInterface {
  constructor(
    @InjectRepository(SpkStageEntity)
    private readonly ormRepo: Repository<SpkStageEntity>,
  ) {}

  async findAll(): Promise<SpkStage[]> {
    const rows = await this.ormRepo.find();
    return rows.map((row) => this.mapToDomain(row));
  }

  async findById(id: string): Promise<SpkStage | null> {
    const row = await this.ormRepo.findOne({ where: { id } });
    return row ? this.mapToDomain(row) : null;
  }

  async create(entity: SpkStage): Promise<SpkStage> {
    const row = this.mapToOrm(entity);
    const saved = await this.ormRepo.save(row);
    return this.mapToDomain(saved);
  }

  async update(entity: SpkStage): Promise<SpkStage> {
    const saved = await this.ormRepo.save(this.mapToOrm(entity));
    return this.mapToDomain(saved);
  }

  private mapToDomain(row: SpkStageEntity): SpkStage {
    return new SpkStage(row.id);
  }

  private mapToOrm(entity: SpkStage): SpkStageEntity {
    const row = new (SpkStageEntity)();
    row.id = entity.id;
    return row;
  }
}