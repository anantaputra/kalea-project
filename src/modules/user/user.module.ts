import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import {
  CreateUserUseCase,
  UpdateUserUseCase,
  FindAllUserUseCase,
  FindUserByIdUseCase,
  DeleteUserUseCase,
} from '../../core/use-cases/user';
import {
  UserRepository,
  USER_REPOSITORY,
} from '../../core/domain/repositories/user.repository.interface';
import { UserRepository as UserRepositoryClass } from '../../infrastructure/database/typeorm/repositories/user.repository';
import { UserEntity } from '../../infrastructure/database/typeorm/entities/User.entity';
import { SecurityModule } from '../../infrastructure/services/security/security.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), SecurityModule],
  controllers: [UserController],
  providers: [
    UserService,
    { provide: USER_REPOSITORY, useClass: UserRepositoryClass },
    {
      provide: CreateUserUseCase,
      useFactory: (repo: UserRepository) => new CreateUserUseCase(repo),
      inject: [USER_REPOSITORY],
    },
    {
      provide: UpdateUserUseCase,
      useFactory: (repo: UserRepository) => new UpdateUserUseCase(repo),
      inject: [USER_REPOSITORY],
    },
    {
      provide: FindAllUserUseCase,
      useFactory: (repo: UserRepository) => new FindAllUserUseCase(repo),
      inject: [USER_REPOSITORY],
    },
    {
      provide: FindUserByIdUseCase,
      useFactory: (repo: UserRepository) => new FindUserByIdUseCase(repo),
      inject: [USER_REPOSITORY],
    },
    {
      provide: DeleteUserUseCase,
      useFactory: (repo: UserRepository) => new DeleteUserUseCase(repo),
      inject: [USER_REPOSITORY],
    },
  ],
  exports: [USER_REPOSITORY],
})
export class UserModule {}