export const basePath = '/audit-logs';
// Must match the privilege auditlogweb registers in its config.xml — plural.
export const PRIVILEGE_VIEW_AUDIT_LOG = 'View Audit Logs';

// Zero-based to match the auditlogweb backend
export const DEFAULT_PAGE_NUMBER = 0;
export const DEFAULT_PAGE_SIZE = 20;
export const DEFAULT_PAGE_SIZES = [10, 20, 50];

// auditlogweb uses dd/MM/yyyy — NOT ISO-8601
export const DATE_FILTER_FORMAT = 'DD/MM/YYYY';
export const DATE_DISPLAY_FORMAT = 'DD/MM/YYYY HH:mm:ss';

// Simple class names — AuditDao matches on Class.getSimpleName().equalsIgnoreCase(entityType).
export const ENTITY_TYPES: Array<{ label: string; value: string }> = [
  { label: 'Patient', value: 'Patient' },
  { label: 'Encounter', value: 'Encounter' },
  { label: 'Observation', value: 'Obs' },
  { label: 'Visit', value: 'Visit' },
  { label: 'Order', value: 'Order' },
  { label: 'User', value: 'User' },
];
