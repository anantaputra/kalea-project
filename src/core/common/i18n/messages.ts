export type Lang = 'id' | 'en';

export function resolveLang(input?: string | null): Lang {
  const norm = (input || '').toLowerCase();
  if (norm.startsWith('en')) return 'en';
  if (norm.startsWith('id')) return 'id';
  return 'id';
}

const catalog = {
  required: {
    id: (field: string) => `${field} wajib diisi`,
    en: (field: string) => `${field} is required`,
  },
  notFound: {
    id: (entity: string) =>
      entity ? `${entity} tidak ditemukan` : `Data tidak ditemukan`,
    en: (entity: string) => (entity ? `${entity} not found` : `Data not found`),
  },
  domainConflictError: {
    id: (entity: string) => (entity ? `${entity} sudah ada` : `Data sudah ada`),
    en: (entity: string) =>
      entity ? `${entity} already exists` : `Data already exists`,
  },
  createdSuccess: {
    id: (entity: string) =>
      entity ? `${entity} berhasil dibuat` : `Data berhasil dibuat`,
    en: (entity: string) =>
      entity ? `${entity} created successfully` : `Data created successfully`,
  },
  updatedSuccess: {
    id: (entity: string) =>
      entity ? `${entity} berhasil diperbarui` : `Data berhasil diperbarui`,
    en: (entity: string) =>
      entity ? `${entity} updated successfully` : `Data updated successfully`,
  },
  deletedSuccess: {
    id: (entity: string) =>
      entity ? `${entity} berhasil dihapus` : `Data berhasil dihapus`,
    en: (entity: string) =>
      entity ? `${entity} deleted successfully` : `Data deleted successfully`,
  },
  retrievedSuccess: {
    id: (entity?: string) =>
      entity ? `${entity} berhasil diambil` : `Data berhasil diambil`,
    en: (entity?: string) =>
      entity
        ? `${entity} retrieved successfully`
        : `Data retrieved successfully`,
  },
} as const;

export function tRequired(field: string, lang?: string): string {
  const l = resolveLang(lang);
  return catalog.required[l](field);
}

export function tNotFound(entity: string, lang?: string): string {
  const l = resolveLang(lang);
  return catalog.notFound[l](entity);
}

export function tDomainConflictError(entity: string, lang?: string): string {
  const l = resolveLang(lang);
  return catalog.domainConflictError[l](entity);
}

export function tCreated(entity: string, lang?: string): string {
  const l = resolveLang(lang);
  return catalog.createdSuccess[l](entity);
}

export function tUpdated(entity: string, lang?: string): string {
  const l = resolveLang(lang);
  return catalog.updatedSuccess[l](entity);
}

export function tDeleted(entity: string, lang?: string): string {
  const l = resolveLang(lang);
  return catalog.deletedSuccess[l](entity);
}

export function tRetrieved(entity?: string, lang?: string): string {
  const l = resolveLang(lang);
  return catalog.retrievedSuccess[l](entity);
}
