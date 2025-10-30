import { UserRepository } from '../../domain/repositories/user.repository.interface';
import { User } from '../../domain/entities/user.entity';

export class FindAllUserUseCase {
  constructor(private readonly repo: UserRepository) {}

  async execute(): Promise<User[]> {
    return this.repo.findAll();
  }
}
