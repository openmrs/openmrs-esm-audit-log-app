import { type DashboardExtensionProps } from '@openmrs/esm-framework';

export const dashboardMeta: Omit<DashboardExtensionProps, 'basePath'> & { slot: string } = {
  slot: 'patient-chart-audit-history-dashboard-slot',
  path: 'audit-history',
  title: 'Audit History',
  // A clock reads as "chronological history"; omrs-icon-report is already the Patient Summary icon.
  icon: 'omrs-icon-time',
};
