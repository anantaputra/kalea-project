import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({})
export class DatabaseModule {
  static register(): DynamicModule {
    const enabledEnv =
      (process.env.DB_ENABLE ?? 'false').toLowerCase() === 'true';

    const imports = enabledEnv
      ? [
          TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
              const db = configService.get('database') as any;

              const rejectUnauthorized = db?.sslRejectUnauthorized ?? false;
              const ssl = db?.ssl ? { rejectUnauthorized } : undefined;

              const base = {
                type: 'postgres' as const,
                entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
                autoLoadEntities: true,
                synchronize:
                  db?.sync ?? configService.get('NODE_ENV') !== 'production',
                logging: db?.logging ?? true,
              };

              const useUrl = typeof db?.url === 'string' && db.url.length > 0;
              if (useUrl) {
                return {
                  ...base,
                  url: db.url,
                  ssl,
                };
              }

              return {
                ...base,
                host: db?.host,
                port: db?.port,
                username: db?.username,
                password: db?.password,
                database: db?.name,
                ssl,
              };
            },
          }),
        ]
      : [];

    return {
      module: DatabaseModule,
      imports,
      exports: [],
    };
  }
}
