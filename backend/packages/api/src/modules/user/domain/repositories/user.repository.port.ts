import { UserEntity, UserEntitySafe } from '../entities/user.entity';

export interface UserRepositoryPort {
  findById(id: string): Promise<UserEntitySafe | null>;

  findByIdOrThrow(id: string): Promise<UserEntitySafe>;

  findByIdWithPassword(id: string): Promise<UserEntity | null>;

  findByEmail(email: string): Promise<UserEntitySafe | null>;
}
