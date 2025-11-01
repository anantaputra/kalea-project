import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/User.entity';
import type { UserRepository as UserRepositoryInterface } from '../../../../core/domain/repositories/user.repository.interface';
import { User } from '../../../../core/domain/entities/user.entity';

@Injectable()
export class UserRepository implements UserRepositoryInterface {
  constructor(
    @InjectRepository(UserEntity)
    private readonly ormRepo: Repository<UserEntity>,
  ) {}

  async findAll(): Promise<User[]> {
    const rows = await this.ormRepo.find({ where: { is_active: true } });
    return rows.map((row) => this.mapToDomain(row));
  }

  async findById(id: string): Promise<User | null> {
    const row = await this.ormRepo.findOne({ where: { id, is_active: true } });
    return row ? this.mapToDomain(row) : null;
  }

  async findByUsernameOrEmail(identifier: string): Promise<User | null> {
    const row = await this.ormRepo.findOne({
      where: [
        { username: identifier, is_active: true },
        { email: identifier, is_active: true },
      ],
    });
    return row ? this.mapToDomain(row) : null;
  }

  async create(entity: User): Promise<User> {
    const row = this.mapToOrm(entity);
    try {
      const saved = await this.ormRepo.save(row);
      return this.mapToDomain(saved);
    } catch (err: any) {
      if (err?.code === '23505') {
        const detail: string = err?.detail || '';
        // Postgres unique violation: identify field
        const isUsername = detail.includes('(username)');
        const isEmail = detail.includes('(email)');
        const message = isUsername
          ? `Username "${entity.username}" sudah digunakan`
          : isEmail
          ? `Email "${entity.email}" sudah digunakan`
          : 'Data yang Anda masukkan sudah terdaftar';
        throw new BadRequestException({
          message,
          errors: {
            code: 'DUPLICATE',
            field: isUsername ? 'username' : isEmail ? 'email' : undefined,
            value: isUsername ? entity.username : isEmail ? entity.email : undefined,
            constraint: err?.constraint,
          },
        });
      }
      throw err;
    }
  }

  async update(entity: User): Promise<User> {
    try {
      const saved = await this.ormRepo.save(this.mapToOrm(entity));
      return this.mapToDomain(saved);
    } catch (err: any) {
      if (err?.code === '23505') {
        const detail: string = err?.detail || '';
        const isUsername = detail.includes('(username)');
        const isEmail = detail.includes('(email)');
        const message = isUsername
          ? `Username "${entity.username}" sudah digunakan`
          : isEmail
          ? `Email "${entity.email}" sudah digunakan`
          : 'Data yang Anda masukkan sudah terdaftar';
        throw new BadRequestException({
          message,
          errors: {
            code: 'DUPLICATE',
            field: isUsername ? 'username' : isEmail ? 'email' : undefined,
            value: isUsername ? entity.username : isEmail ? entity.email : undefined,
            constraint: err?.constraint,
          },
        });
      }
      throw err;
    }
  }

  async delete(id: string): Promise<void> {
    await this.ormRepo.delete({ id });
  }

  private mapToDomain(row: UserEntity): User {
    return new User(
      row.id,
      row.first_name,
      row.last_name ?? null,
      row.username,
      row.email,
      row.password,
      row.is_active,
      row.role,
      row.created_by,
      row.created_dt,
      row.changed_by ?? 'system',
      row.changed_dt ?? row.created_dt,
    );
  }

  private mapToOrm(entity: User): UserEntity {
    const row = new UserEntity();
    if (entity.id) {
      (row as any).id = entity.id;
    }
    row.first_name = entity.first_name;
    row.last_name = entity.last_name ?? (null as any);
    row.username = entity.username;
    row.email = entity.email;
    row.password = entity.password;
    row.is_active = entity.is_active;
    row.role = entity.role;
    row.created_by = entity.created_by;
    row.created_dt = entity.created_dt;
    row.changed_by = entity.changed_by;
    row.changed_dt = entity.changed_dt;
    return row;
  }
}
