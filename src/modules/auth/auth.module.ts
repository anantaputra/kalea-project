import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SecurityModule } from '../../infrastructure/services/security/security.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    UserModule,
    SecurityModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const secret = config.get<string>('JWT_SECRET') ?? 'dev-secret';
        const raw = config.get<string>('JWT_EXPIRES_IN');
        const expiresIn = raw && /^\d+$/.test(raw) ? Number(raw) : 3600; // seconds
        return {
          secret,
          signOptions: { expiresIn },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}