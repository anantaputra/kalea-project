# Scaffolding with Plop

This project includes Plop generators to quickly scaffold new features following the clean architecture layout.

## Commands

- Run interactively: `npm run plop`
- Run non-interactively (provide answers via flags is not supported by Plop; use interactive mode).

## Generator: feature
Generates domain, use-cases, TypeORM infrastructure, and optional Nest modules (controller/service/module/DTOs) for a feature.

Prompts (granular include/exclude):
- Feature name — required
- HTTP base route — default: dash-case of feature name
- Domain: entity / repository interface / value object (Id)
- Use-cases: create / update
- Infrastructure: TypeORM entity / repository impl
  - Repo impl can use existing ORM entity; if yes, provide class name and import path.
- Modules: controller / service / module / DTOs

### Output structure
- `src/core/domain/entities/<feature>.entity.ts` (optional)
- `src/core/domain/repositories/<feature>.repository.interface.ts` (optional)
- `src/core/domain/value-objects/<feature>-id.vo.ts` (optional)
- `src/core/use-cases/<feature>/create-<feature>.usecase.ts` (optional)
- `src/core/use-cases/<feature>/update-<feature>.usecase.ts` (optional)
- `src/core/use-cases/<feature>/index.ts` (auto-added when use-cases generated)
- `src/infrastructure/database/typeorm/entities/<Feature>.entity.ts` (optional)
- `src/infrastructure/database/typeorm/repositories/<feature>.repository.ts` (optional)
- `src/modules/<feature>/<feature>.controller.ts` (optional)
- `src/modules/<feature>/<feature>.service.ts` (optional)
- `src/modules/<feature>/<feature>.module.ts` (optional)
- `src/modules/<feature>/dto/create-<feature>.dto.ts` (optional)
- `src/modules/<feature>/dto/update-<feature>.dto.ts` (optional)

> Note: Replace `<feature>` with the dash-case version of your name (e.g., `user`, `order-item`), and `<Feature>` with the ProperCase version (e.g., `User`, `OrderItem`).

## Next steps after generating
- Add additional columns to the TypeORM entity (`entities/<Feature>.entity.ts`).
- Extend the domain entity with needed properties/methods.
- Bind the domain repository interface to its implementation using an injection token: `{{FEATURE}}_REPOSITORY`.
  - Example provider mapping in a module: `{ provide: USER_REPOSITORY, useClass: UserRepository }`.
  - Use-cases factory and services should inject this token (the generator supports this wiring option).
- Customize and extend the controller/service and DTOs under `src/modules/<feature>` as needed.

## Notes
- Generators are intentionally minimal and avoid assumptions so they don’t break existing code.
- Works on Windows PowerShell. If you run into path issues, use the interactive prompt (`npm run plop`).