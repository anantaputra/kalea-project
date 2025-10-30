import { Injectable, BadRequestException, UnauthorizedException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { LoginDto } from './dto/login.dto';
import { USER_REPOSITORY } from '../../core/domain/repositories/user.repository.interface';
import type { UserRepository } from '../../core/domain/repositories/user.repository.interface';
import { SecurityService } from '../../infrastructure/services/security/security.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepo: UserRepository,
    private readonly securityService: SecurityService,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const identifier = dto.username ?? dto.email;
    if (!identifier) {
      throw new BadRequestException('username atau email wajib diisi');
    }

    const user = await this.userRepo.findByUsernameOrEmail(identifier);
    if (!user || !user.is_active) {
      throw new UnauthorizedException('Kredensial tidak valid');
    }

    const ok = await this.securityService.verify(dto.password, user.password);
    if (!ok) {
      throw new UnauthorizedException('Kredensial tidak valid');
    }

    const payload = { sub: user.id, username: user.username, role: user.role };
    const access_token = await this.jwtService.signAsync(payload);

    const full_name = [user.first_name, user.last_name].filter(Boolean).join(' ');

    return {
      success: true,
      message: 'Login berhasil',
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          full_name,
        },
        token: {
          access_token,
        },
      },
    };
  }
}