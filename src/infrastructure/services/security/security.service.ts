import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

type KeyFormat = 'base64' | 'hex';

@Injectable()
export class SecurityService {
  constructor(private readonly configService: ConfigService) {}

  private getKey(): Buffer {
    const keyStr = this.configService.get<string>('security.encryptionKey');
    if (!keyStr) throw new Error('ENCRYPTION_KEY is not set');
    const format = (
      this.configService.get<string>('security.encryptionKeyFormat') ?? 'base64'
    ).toLowerCase() as KeyFormat;
    const key =
      format === 'hex'
        ? Buffer.from(keyStr, 'hex')
        : Buffer.from(keyStr, 'base64');
    if (key.length !== 32)
      throw new Error('ENCRYPTION_KEY must decode to 32 bytes');
    return key;
  }

  async hash(plaintext: string): Promise<string> {
    const rounds =
      this.configService.get<number>('security.bcryptSaltRounds') ?? 10;
    const salt = await bcrypt.genSalt(rounds);
    return await bcrypt.hash(plaintext, salt);
  }

  async verify(plaintext: string, hashed: string): Promise<boolean> {
    return await bcrypt.compare(plaintext, hashed);
  }

  encrypt(plaintext: string): string {
    const key = this.getKey();
    const iv = crypto.randomBytes(12); // recommended length for GCM
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
    const ciphertext = Buffer.concat([
      cipher.update(plaintext, 'utf8'),
      cipher.final(),
    ]);
    const tag = cipher.getAuthTag();
    return [
      'v1',
      iv.toString('base64'),
      ciphertext.toString('base64'),
      tag.toString('base64'),
    ].join(':');
  }

  decrypt(payload: string): string {
    const [v, ivB64, ctB64, tagB64] = payload.split(':');
    if (v !== 'v1' || !ivB64 || !ctB64 || !tagB64)
      throw new Error('Invalid encrypted payload format');
    const key = this.getKey();
    const iv = Buffer.from(ivB64, 'base64');
    const data = Buffer.from(ctB64, 'base64');
    const tag = Buffer.from(tagB64, 'base64');
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(tag);
    const plaintext = Buffer.concat([decipher.update(data), decipher.final()]);
    return plaintext.toString('utf8');
  }
}
