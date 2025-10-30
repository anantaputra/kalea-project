import { UserRepository } from '../../domain/repositories/user.repository.interface';
import { User } from '../../domain/entities/user.entity';

export class FindUserByIdUseCase {
  constructor(private readonly repo: UserRepository) {}

  async execute(id: string): Promise<User | null> {
    return this.repo.findById(id);
  }
}
