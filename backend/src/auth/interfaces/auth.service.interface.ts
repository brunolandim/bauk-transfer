import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';

export interface IAuthService {
  register(dto: RegisterDto): Promise<void>;
  login(dto: LoginDto): Promise<{ token: string }>;
}

export const IAuthService = Symbol('IAuthService');
