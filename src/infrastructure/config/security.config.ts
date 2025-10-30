export default () => {
  const formatRaw = (
    process.env.ENCRYPTION_KEY_FORMAT ?? 'base64'
  ).toLowerCase();
  const encryptionKeyFormat: 'base64' | 'hex' =
    formatRaw === 'hex' ? 'hex' : 'base64';
  const bcryptSaltRounds = Number.isFinite(
    Number(process.env.BCRYPT_SALT_ROUNDS),
  )
    ? Number(process.env.BCRYPT_SALT_ROUNDS)
    : 10;

  return {
    security: {
      encryptionKeyFormat,
      encryptionKey: process.env.ENCRYPTION_KEY ?? '',
      bcryptSaltRounds,
    },
  } as const;
};
