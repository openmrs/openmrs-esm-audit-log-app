import type { AuditFieldDiff } from './types';

export const PRIVILEGE_VIEW_AUDIT_LOG = 'View Audit Logs';

export const DEFAULT_PAGE_SIZE = 10;

export const TECHNICAL_FIELDS = new Set<string>([
  'dateCreated',
  'dateChanged',
  'dateVoided',
  'dateRetired',
  'creator',
  'changedBy',
  'voidedBy',
  'retiredBy',
  'personDateCreated',
  'personDateChanged',
  'personDateVoided',
  'personCreator',
  'personChangedBy',
  'personVoidedBy',
  'uuid',
  'id',
  'patientId',
  'personId',
  'patientIdentifierId',
  'personAttributeId',
]);

export function getVisibleChanges(changes: AuditFieldDiff[] = []): AuditFieldDiff[] {
  return changes.filter((change) => change.changed !== false && !TECHNICAL_FIELDS.has(change.fieldName));
}

export function isFullSnapshot(visibleChanges: AuditFieldDiff[]): boolean {
  return visibleChanges.length > 0 && visibleChanges.every((change) => change.oldValue === '');
}
