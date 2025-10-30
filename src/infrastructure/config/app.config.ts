export default () => {
  const env = (key: string, def?: string) => process.env[key] ?? def;
  const num = (key: string, def: number) => {
    const val = process.env[key];
    const n = val ? Number(val) : NaN;
    return Number.isFinite(n) ? n : def;
  };

  const nodeEnv = env('NODE_ENV', 'development')!;

  return {
    app: {
      name: env('APP_NAME', 'KALEA-API'),
      version: env('APP_VERSION', '1.0.0'),
      port: num('APP_PORT', 3000),
      nodeEnv,
    },
  } as const;
};
