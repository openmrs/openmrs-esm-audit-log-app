export type AuditEventType = 'ADD' | 'MOD' | 'DEL';

export interface AuditFieldDiff {
  fieldName: string;
  oldValue: string;
  currentValue: string;
  changed: boolean;
  // Backend-resolved human-readable names for references (concepts, users, locations);
  // the raw values arrive as e.g. `Concept#88`.
  oldDisplay?: string | null;
  currentDisplay?: string | null;
}

export interface AuditLogDetail {
  revisionID: number;
  entityType: string;
  eventType: AuditEventType | string;
  changedBy: string;
  // "dd/MM/yyyy HH:mm:ss" GMT — as returned by the auditlogweb module
  changedOn: string;
  // Omitted by the backend unless a non-pagination filter is active.
  changes?: AuditFieldDiff[];
}

export interface AuditLogResponse {
  totalLogs: number;
  currentPage: number;
  totalPages: number;
  logs: AuditLogDetail[];
}

// Simple class names of every @Audited entity the backend knows about.
export interface AuditEntityTypesResponse {
  entityTypes: string[];
}

export interface AuditLogFilterState {
  entityType: string;
  username: string;
  startDate: Date | null;
  endDate: Date | null;
}
