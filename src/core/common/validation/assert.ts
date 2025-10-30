import { DomainValidationError } from '../exceptions/domain.errors';
import { tRequired, tNotFound } from '../i18n/messages';
import { DomainNotFoundError } from '../exceptions/domain.errors';

export function requireNonEmptyTrimmed(
  value: string | undefined | null,
  field: string,
  lang?: string,
): string {
  const trimmed = value?.trim();
  if (!trimmed) {
    throw new DomainValidationError(tRequired(field, lang));
  }
  return trimmed;
}

export function requireFound<T>(
  value: T | undefined | null,
  entityLabel: string,
  lang?: string,
): T {
  if (value === undefined || value === null) {
    throw new DomainNotFoundError(tNotFound(entityLabel, lang));
  }
  return value as T;
}
