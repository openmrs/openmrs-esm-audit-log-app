import {
  createDashboard,
  defineConfigSchema,
  getAsyncLifecycle,
  getSyncLifecycle,
  registerBreadcrumbs,
} from '@openmrs/esm-framework';
import { getFixedT } from 'i18next';
import { moduleName } from './constants';
import { configSchema } from './config-schema';
import { basePath } from './admin-audit-log/constants';
import { dashboardMeta } from './patient-audit-history/dashboard.meta';
import auditHistoryComponent from './patient-audit-history/audit-history/audit-history.component';

const adminOptions = {
  featureName: 'audit-log',
  moduleName,
};

const patientOptions = {
  featureName: 'patient-audit-history',
  moduleName,
};

export const importTranslation = require.context('../translations', false, /.json$/, 'lazy');

export function startupApp() {
  const t = getFixedT(undefined, moduleName);

  // The system-administration breadcrumb is registered by esm-system-admin-app;
  // we only add our own leaf, pointing at it as the parent.
  registerBreadcrumbs([
    {
      title: () => Promise.resolve(t('auditLogs', 'Audit Logs')),
      path: `${window.getOpenmrsSpaBase()}${basePath.slice(1)}`,
      parent: `${window.getOpenmrsSpaBase()}system-administration`,
    },
  ]);

  defineConfigSchema(moduleName, configSchema);
}

// Admin dashboard (system administration > Audit Logs)
export const root = getAsyncLifecycle(() => import('./admin-audit-log/root.component'), adminOptions);
export const auditLogLink = getAsyncLifecycle(() => import('./admin-audit-log/audit-log-link.component'), adminOptions);

// Patient chart Audit History tab
export const auditHistoryDashboard = getSyncLifecycle(auditHistoryComponent, patientOptions);

// t('Audit History', 'Audit History')
// t('entityPersonName', 'Name')
// t('entityPatientIdentifier', 'Identifier')
// t('entityPersonAddress', 'Address')
// t('entityPersonAttribute', 'Attribute')
// t('genderMale', 'Male')
// t('genderFemale', 'Female')
// t('genderOther', 'Other')
// t('genderUnknown', 'Unknown')
// t('yes', 'Yes')
// t('no', 'No')
export const auditHistoryDashboardLink = getSyncLifecycle(createDashboard({ ...dashboardMeta }), patientOptions);
