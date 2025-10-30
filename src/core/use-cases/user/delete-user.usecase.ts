import { UserRepository } from '../../domain/repositories/user.repository.interface';

export class DeleteUserUseCase {
  constructor(private readonly repo: UserRepository) {}

  async execute(id: string): Promise<void> {
    return this.repo.delete(id);
  }
}
