import { User } from '../entities/user.entity';

export interface UserRepository {
  findById(id: string): Promise<User | null>;
  findAll(): Promise<User[]>;
  findByUsernameOrEmail(identifier: string): Promise<User | null>;
  create(entity: User): Promise<User>;
  update(entity: User): Promise<User>;
  delete(id: string): Promise<void>;
}

export const USER_REPOSITORY = Symbol('UserRepository');
