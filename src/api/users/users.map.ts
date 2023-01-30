import { BIT_VALUE } from '../../constants/general.constant';
import { passwordEncrypt } from '../auth/auth.service';
import { IUser } from './users.interface';

export const parseRegisterReq = (user: Partial<IUser>) => ({
  ...user,
  active: BIT_VALUE.TRUE,
  password: passwordEncrypt(user.password),
});
