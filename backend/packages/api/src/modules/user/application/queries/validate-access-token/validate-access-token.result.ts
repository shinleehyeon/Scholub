import { UserEntity } from '@modules/user/domain/entities/user.entity';
import { DataClass } from 'dataclasses';

export class ValidateAccessTokenResult extends DataClass {
  user: Omit<UserEntity, 'password'>;
}

