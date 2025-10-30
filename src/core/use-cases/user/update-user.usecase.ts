import { UserRepository } from '../../domain/repositories/user.repository.interface';
import { User } from '../../domain/entities/user.entity';

export class UpdateUserUseCase {
  constructor(private readonly repo: UserRepository) {}

  async execute(entity: User): Promise<User> {
    return this.repo.update(entity);
  }
}
