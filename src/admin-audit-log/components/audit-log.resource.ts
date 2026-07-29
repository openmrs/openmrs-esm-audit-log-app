import { useMemo } from 'react';
import { openmrsFetch, restBaseUrl } from '@openmrs/esm-framework';
import dayjs from 'dayjs';
import useSWR from 'swr';
import { DATE_FILTER_FORMAT } from '../constants';
import type { AuditEntityTypesResponse, AuditLogFilterState, AuditLogResponse } from '../types';

/**
 * Lists every entity type the backend audits, so the entity-type filter can offer them all as
 * searchable options without hardcoding a list. The endpoint returns simple class names and is
 * cheap — auditlogweb resolves the @Audited classes once and caches them for the server's lifetime.
 *
 * Only available from auditlogweb 1.1.0. On older backends the request 404s and this returns an
 * empty list, which leaves the filter showing just the pinned common types.
 */
export function useAuditEntityTypes() {
  const url = `${restBaseUrl}/auditlogs/entityTypes`;
  const { data, error, isLoading } = useSWR<{ data: AuditEntityTypesResponse }, Error>(url, openmrsFetch, {
    revalidateOnFocus: false,
  });

  const entityTypes = useMemo(() => [...(data?.data?.entityTypes ?? [])].sort((a, b) => a.localeCompare(b)), [data]);

  return { entityTypes, isLoading, error };
}

export function useAuditLogs(filters: AuditLogFilterState, page: number, size: number) {
  const params = new URLSearchParams();
  params.set('page', String(page));
  params.set('size', String(size));

  const hasEntityType = Boolean(filters.entityType);
  const hasUsername = Boolean(filters.username?.trim());
  const startDate = dayjs(filters.startDate);
  const endDate = dayjs(filters.endDate);
  const hasStartDate = Boolean(filters.startDate) && startDate.isValid();
  const hasEndDate = Boolean(filters.endDate) && endDate.isValid();

  if (hasEntityType) params.set('entityType', filters.entityType);
  if (hasUsername) params.set('username', filters.username.trim());
  if (hasStartDate) params.set('startDate', startDate.format(DATE_FILTER_FORMAT));
  if (hasEndDate) params.set('endDate', endDate.format(DATE_FILTER_FORMAT));

  // Diffs are only returned server-side when at least one non-pagination filter is active.
  const hasActiveFilter = hasEntityType || hasUsername || hasStartDate || hasEndDate;

  const url = hasActiveFilter ? `${restBaseUrl}/auditlogs?${params.toString()}` : null;

  const { data, error, isLoading, isValidating, mutate } = useSWR<{ data: AuditLogResponse }, Error>(
    url,
    openmrsFetch,
    {
      revalidateOnFocus: true,
      dedupingInterval: 2000,
    },
  );

  return {
    logs: data?.data?.logs ?? [],
    totalLogs: data?.data?.totalLogs ?? 0,
    totalPages: data?.data?.totalPages ?? 0,
    currentPage: data?.data?.currentPage ?? 0,
    isLoading,
    isValidating,
    error,
    mutate,
    hasActiveFilter,
  };
}
