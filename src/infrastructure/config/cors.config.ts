export default () => {
  const originsRaw = (process.env.CORS_ORIGINS ?? '').trim();
  const origins = originsRaw
    ? originsRaw
        .split(',')
        .map((o) => o.trim())
        .filter(Boolean)
    : [];
  const credentials =
    (process.env.CORS_CREDENTIALS ?? 'true').toLowerCase() === 'true';

  return {
    cors: {
      origins,
      credentials,
    },
  } as const;
};
