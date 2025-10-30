export type CreateApprovalTransactionPayload = {
  module: string; // e.g., 'SPK'
  ref_id: string; // UUID of the approved entity
  status: string; // 'APPROVED' | 'REJECTED' | 'PENDING'
  notes?: string | null;
  created_by?: string;
};

export interface ApprovalRepository {
  create(payload: CreateApprovalTransactionPayload): Promise<{ approval_id: string }>;
}

export const APPROVAL_REPOSITORY = Symbol('ApprovalRepository');