export type DeliveryNoteType = {
  type: string;
  code: string;
};

export const DeliveryNoteTypes: ReadonlyArray<DeliveryNoteType> = [
  { type: 'Surat jalan permintaan kain', code: 'ORDER' },
  { type: 'Surat jalan buang benang keluar', code: 'BB/K' },
  { type: 'Surat jalan buang benang masuk', code: 'BB/M' },
  { type: 'Surat jalan jahit keluar', code: 'JHT/K' },
  { type: 'Surat jalan jahit masuk', code: 'JHT/M' },
  { type: 'Surat jalan pengiriman barang', code: 'DELIVERY' },
] as const;

export function findDeliveryNoteTypeByCode(
  code: string,
): DeliveryNoteType | undefined {
  return DeliveryNoteTypes.find((d) => d.code === code);
}

export function getDeliveryNoteTypeLabelByCode(code: string): string {
  return findDeliveryNoteTypeByCode(code)?.type ?? code;
}