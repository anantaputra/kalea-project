export default () => {
  const env = (key: string, def?: string) => process.env[key] ?? def;
  const bool = (key: string, def = false) =>
    env(key)?.toLowerCase() === 'true' ? true : def;
  const num = (key: string, def: number) => {
    const v = env(key);
    const n = v ? parseInt(v, 10) : NaN;
    return Number.isFinite(n) ? n : def;
  };

  const url = env('DB_URL') || env('DATABASE_URL');
  const nodeEnv = env('NODE_ENV', 'development');

  return {
    database: {
      enabled: bool('DB_ENABLE', false),
      url,
      host: env('DB_HOST', 'localhost'),
      port: num('DB_PORT', 5432),
      username: env('DB_USERNAME', 'postgres'),
      password: env('DB_PASSWORD', ''),
      name: env('DB_NAME', 'postgres'),
      ssl: bool('DB_SSL', false),
      sslRejectUnauthorized: bool('DB_SSL_REJECT_UNAUTHORIZED', false),
      sync:
        env('DB_SYNC') !== undefined
          ? bool('DB_SYNC', false)
          : nodeEnv !== 'production',
      logging: bool('DB_LOGGING', false),
      nodeEnv,
    },
  };
};
