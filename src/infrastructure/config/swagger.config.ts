export default () => {
  const enable =
    (process.env.SWAGGER_ENABLE ?? 'true').toLowerCase() === 'true';
  const path = process.env.SWAGGER_PATH ?? 'docs';

  return {
    swagger: {
      enable,
      path,
      title: process.env.SWAGGER_TITLE ?? process.env.APP_NAME ?? 'API',
      desc: process.env.SWAGGER_DESC ?? 'API documentation',
      version:
        process.env.SWAGGER_VERSION ?? process.env.APP_VERSION ?? '1.0.0',
    },
  } as const;
};
