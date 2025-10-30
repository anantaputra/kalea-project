import { Auth } from '../entities/auth.entity';

export interface AuthRepository {
  findById(id: string): Promise<Auth | null>;
  findAll(): Promise<Auth[]>;
  create(entity: Auth): Promise<Auth>;
  update(entity: Auth): Promise<Auth>;
}

export const AUTH_REPOSITORY = Symbol('AuthRepository');