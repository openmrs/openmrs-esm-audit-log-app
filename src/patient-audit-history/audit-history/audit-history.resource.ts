import { useMemo } from 'react';
import { type FetchError, restBaseUrl, useOpenmrsSWR } from '@openmrs/esm-framework';
import type { PatientAuditLogResponse } from '../types';

export function usePatientAuditHistory(patientUuid: string, page: number, size: number) {
  const url = patientUuid ? `${restBaseUrl}/auditlogs/patients?uuid=${patientUuid}&page=${page}&size=${size}` : null;

  const { data, error, isLoading, isValidating, mutate } = useOpenmrsSWR<PatientAuditLogResponse, FetchError>(url, {
    swrConfig: { revalidateOnFocus: false, keepPreviousData: true },
  });

  return useMemo(
    () => ({
      logs: data?.data?.logs ?? [],
      totalLogs: data?.data?.totalLogs ?? 0,
      totalPages: data?.data?.totalPages ?? 0,
      currentPage: data?.data?.currentPage ?? 0,
      isLoading,
      isValidating,
      error,
      mutate,
    }),
    [data, isLoading, isValidating, error, mutate],
  );
}
