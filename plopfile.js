module.exports = function (plop) {
  plop.setGenerator('feature', {
    description:
      'Generate clean-architecture feature: domain, use-cases, infra (TypeORM), and optional modules (controller/service/DTOs). Supports granular include/exclude.',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Feature name (e.g., User, Order, Product):',
        validate: (v) => (v && v.trim().length > 0 ? true : 'Name is required'),
      },
      {
        type: 'input',
        name: 'baseRoute',
        message: 'HTTP base route (default: dash-case of name):',
        default: (answers) =>
          answers.name ? answers.name.trim().replace(/\s+/g, '-').toLowerCase() : '',
      },
      // Domain granularity
      { type: 'confirm', name: 'domainEntity', message: 'Generate domain entity?', default: true },
      {
        type: 'confirm',
        name: 'domainRepository',
        message: 'Generate domain repository interface?',
        default: true,
      },
      { type: 'confirm', name: 'domainVO', message: 'Generate domain value object (Id)?', default: true },
      // Use-cases granularity
      { type: 'confirm', name: 'ucCreate', message: 'Generate Create use-case?', default: true },
      { type: 'confirm', name: 'ucUpdate', message: 'Generate Update use-case?', default: true },
      // Infra granularity
      { type: 'confirm', name: 'ormEntity', message: 'Generate TypeORM entity?', default: true },
      {
        type: 'confirm',
        name: 'ormRepoImpl',
        message: 'Generate TypeORM repository implementation?',
        default: true,
      },
      {
        type: 'confirm',
        name: 'useExistingOrmEntity',
        message: 'Use existing ORM entity for the repository impl?',
        default: false,
        when: (a) => a.ormRepoImpl,
      },
      {
        type: 'input',
        name: 'entityClassName',
        message: 'Existing ORM entity class name (e.g., UserEntity):',
        when: (a) => a.ormRepoImpl && a.useExistingOrmEntity,
        validate: (v) => (v && v.trim().length > 0 ? true : 'Class name required'),
      },
      {
        type: 'input',
        name: 'entityImportPath',
        message:
          'Existing ORM entity import path (relative to repo impl, e.g., ../entities/User.entity):',
        when: (a) => a.ormRepoImpl && a.useExistingOrmEntity,
        validate: (v) => (v && v.trim().length > 0 ? true : 'Import path required'),
      },
      // Modules granularity (HTTP layer)
      { type: 'confirm', name: 'modController', message: 'Generate module controller?', default: true },
      { type: 'confirm', name: 'modService', message: 'Generate module service?', default: true },
      {
        type: 'list',
        name: 'serviceWiring',
        message: 'Service wiring strategy',
        choices: [
          { name: 'None (stub)', value: 'none' },
          { name: 'Use-cases (recommended)', value: 'usecases' },
          { name: 'Repository interface', value: 'repository' },
        ],
        default: 'usecases',
        when: (a) => a.modService,
      },
      { type: 'confirm', name: 'modModule', message: 'Generate Nest module file?', default: true },
      { type: 'confirm', name: 'modDtos', message: 'Generate DTOs?', default: true },
    ],
    actions: (data) => {
      const actions = [];

      // Domain
      if (data.domainEntity) {
        actions.push({
          type: 'add',
          path: 'src/core/domain/entities/{{dashCase name}}.entity.ts',
          templateFile: 'plop-templates/core/domain/entities/entity.ts.hbs',
        });
      }
      if (data.domainRepository) {
        actions.push({
          type: 'add',
          path: 'src/core/domain/repositories/{{dashCase name}}.repository.interface.ts',
          templateFile: 'plop-templates/core/domain/repositories/repository.interface.ts.hbs',
        });
      }
      if (data.domainVO) {
        actions.push({
          type: 'add',
          path: 'src/core/domain/value-objects/{{dashCase name}}-id.vo.ts',
          templateFile: 'plop-templates/core/domain/value-objects/id.vo.ts.hbs',
        });
      }

      // Use-cases
      const usecaseFiles = [];
      if (data.ucCreate) {
        usecaseFiles.push({
          type: 'add',
          path: 'src/core/use-cases/{{dashCase name}}/create-{{dashCase name}}.usecase.ts',
          templateFile: 'plop-templates/core/use-cases/create.usecase.ts.hbs',
        });
      }
      if (data.ucUpdate) {
        usecaseFiles.push({
          type: 'add',
          path: 'src/core/use-cases/{{dashCase name}}/update-{{dashCase name}}.usecase.ts',
          templateFile: 'plop-templates/core/use-cases/update.usecase.ts.hbs',
        });
      }
      actions.push(...usecaseFiles);
      if (usecaseFiles.length) {
        actions.push({
          type: 'add',
          path: 'src/core/use-cases/{{dashCase name}}/index.ts',
          templateFile: 'plop-templates/core/use-cases/index.ts.hbs',
        });
      }

      // Infrastructure
      if (data.ormEntity) {
        actions.push({
          type: 'add',
          path: 'src/infrastructure/database/typeorm/entities/{{properCase name}}.entity.ts',
          templateFile:
            'plop-templates/infrastructure/database/typeorm/entities/orm-entity.ts.hbs',
        });
      }
      if (data.ormRepoImpl) {
        actions.push({
          type: 'add',
          path:
            'src/infrastructure/database/typeorm/repositories/{{dashCase name}}.repository.ts',
          templateFile:
            'plop-templates/infrastructure/database/typeorm/repositories/repository.ts.hbs',
          data: {
            entityClassName: data.useExistingOrmEntity ? data.entityClassName : undefined,
            entityImportPath: data.useExistingOrmEntity ? data.entityImportPath : undefined,
          },
        });
      }

      // Modules (HTTP layer)
      if (data.modController) {
        actions.push({
          type: 'add',
          path: 'src/modules/{{dashCase name}}/{{dashCase name}}.controller.ts',
          templateFile: 'plop-templates/modules/controller.ts.hbs',
          data: {
            baseRoute: data.baseRoute || '{{dashCase name}}',
            hasDto: !!data.modDtos,
            hasService: !!data.modService,
          },
        });
      }
      if (data.modService) {
        actions.push({
          type: 'add',
          path: 'src/modules/{{dashCase name}}/{{dashCase name}}.service.ts',
          templateFile: 'plop-templates/modules/service.ts.hbs',
          data: {
            wireUseCases: data.modService && data.serviceWiring === 'usecases',
            wireRepository: data.modService && data.serviceWiring === 'repository',
          },
        });
      }
      if (data.modModule) {
        actions.push({
          type: 'add',
          path: 'src/modules/{{dashCase name}}/{{dashCase name}}.module.ts',
          templateFile: 'plop-templates/modules/module.ts.hbs',
          data: {
            hasService: !!data.modService,
            wireUseCases: data.modService && data.serviceWiring === 'usecases',
            wireRepository: data.modService && data.serviceWiring === 'repository',
            bindRepository: data.modService && (data.serviceWiring === 'usecases' || data.serviceWiring === 'repository'),
          },
        });
      }
      if (data.modDtos) {
        actions.push(
          {
            type: 'add',
            path: 'src/modules/{{dashCase name}}/dto/create-{{dashCase name}}.dto.ts',
            templateFile: 'plop-templates/modules/dto/create.dto.ts.hbs',
          },
          {
            type: 'add',
            path: 'src/modules/{{dashCase name}}/dto/update-{{dashCase name}}.dto.ts',
            templateFile: 'plop-templates/modules/dto/update.dto.ts.hbs',
          }
        );
      }

      return actions;
    },
  });
};