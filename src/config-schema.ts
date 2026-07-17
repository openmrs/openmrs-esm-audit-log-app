import { Type } from '@openmrs/esm-framework';
import { PRIVILEGE_VIEW_AUDIT_LOG as ADMIN_PRIVILEGE_VIEW_AUDIT_LOG } from './admin-audit-log/constants';
import {
  DEFAULT_PAGE_SIZE,
  PRIVILEGE_VIEW_AUDIT_LOG as PATIENT_PRIVILEGE_VIEW_AUDIT_LOG,
} from './patient-audit-history/constants';

export const configSchema = {
  adminAuditLog: {
    viewPrivilege: {
      _type: Type.String,
      _description:
        'Privilege required to view the audit log. Must match the privilege the auditlogweb backend module registers. Set to an empty string to disable the client-side gate.',
      _default: ADMIN_PRIVILEGE_VIEW_AUDIT_LOG,
    },
  },
  patientAuditHistory: {
    viewPrivilege: {
      _type: Type.String,
      _description:
        "Privilege required to view a patient's audit history. Leave blank to disable the check on deployments that don't register the privilege.",
      _default: PATIENT_PRIVILEGE_VIEW_AUDIT_LOG,
    },
    auditHistoryPageSize: {
      _type: Type.Number,
      _description: 'The number of audit history revisions to show per page.',
      _default: DEFAULT_PAGE_SIZE,
    },
  },
};

export interface ConfigObject {
  adminAuditLog: {
    viewPrivilege: string;
  };
  patientAuditHistory: {
    viewPrivilege: string;
    auditHistoryPageSize: number;
  };
}
