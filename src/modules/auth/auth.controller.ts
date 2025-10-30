import { Controller, Post, Body } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags, ApiBadRequestResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'User login', description: 'Autentikasi menggunakan username atau email dan password, mengembalikan detail user dan JWT access token.' })
  @ApiBody({
    type: LoginDto,
    examples: {
      byUsername: {
        summary: 'Login dengan username',
        value: { username: 'johndoe', password: 'secret123' },
      },
      byEmail: {
        summary: 'Login dengan email',
        value: { email: 'john.doe@example.com', password: 'secret123' },
      },
    },
  })
  @ApiOkResponse({
    description: 'Login berhasil',
    schema: {
      example: {
        success: true,
        message: 'Login berhasil',
        data: {
          user: {
            id: 'a1b2c3d4-e5f6-7890-1234-56789abcdef0',
            username: 'johndoe',
            email: 'john.doe@example.com',
            role: 'ADMIN',
            full_name: 'John Doe',
          },
          token: {
            access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          },
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Payload tidak valid',
    schema: {
      example: {
        success: false,
        message: 'username atau email wajib diisi',
        errors: null,
        timestamp: '2025-10-23T09:05:11.000Z',
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Kredensial tidak valid',
    schema: {
      example: {
        success: false,
        message: 'Kredensial tidak valid',
        errors: null,
        timestamp: '2025-10-23T09:05:11.000Z',
      },
    },
  })
  async login(@Body() dto: LoginDto) {
    return this.service.login(dto);
  }
}