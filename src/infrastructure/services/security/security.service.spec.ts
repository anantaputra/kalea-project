import { Test, TestingModule } from '@nestjs/testing';
import { SecurityService } from './security.service';
import { ConfigModule } from '@nestjs/config';
import securityConfig from '../../config/security.config';

describe('SecurityService', () => {
  let service: SecurityService;

  beforeAll(async () => {
    // Provide a deterministic 32-byte key for tests if not set
    if (!process.env.ENCRYPTION_KEY) {
      const buf = Buffer.alloc(32, 1);
      process.env.ENCRYPTION_KEY = buf.toString('base64');
    }
    process.env.ENCRYPTION_KEY_FORMAT = 'base64';

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true, load: [securityConfig] }),
      ],
      providers: [SecurityService],
    }).compile();

    service = module.get(SecurityService);
  });

  it('hash and verify works', async () => {
    const hashed = await service.hash('secret');
    expect(await service.verify('secret', hashed)).toBe(true);
    expect(await service.verify('wrong', hashed)).toBe(false);
  });

  it('encrypt and decrypt roundtrip', () => {
    const encrypted = service.encrypt('hello');
    const decrypted = service.decrypt(encrypted);
    expect(decrypted).toBe('hello');
  });
});
