import { vi, describe, it, expect, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import dayjs from 'dayjs';
// eslint-disable-next-line import/no-duplicates -- the namespace type import below cannot be merged into this one
import { type FetchResponse, useOpenmrsSWR } from '@openmrs/esm-framework';
import { useAuditLogs } from './audit-log.resource';
import { DATE_FILTER_FORMAT } from '../constants';
import type { AuditLogFilterState, AuditLogResponse } from '../types';
// eslint-disable-next-line import/no-duplicates -- consistent-type-imports forbids the `typeof import(...)` alternative
import type * as EsmFramework from '@openmrs/esm-framework';

// Keep the project's shared framework mock; only stub the fetching hook under test.
vi.mock('@openmrs/esm-framework', async (importOriginal) => ({
  ...(await importOriginal<typeof EsmFramework>()),
  useOpenmrsSWR: vi.fn(),
}));

const mockUseOpenmrsSWR = vi.mocked(useOpenmrsSWR);

const emptyFilters: AuditLogFilterState = {
  entityType: '',
  username: '',
  startDate: null,
  endDate: null,
};

// These tests only assert on the SWR key, so a minimal stand-in for the fetch response is enough.
const mockResponse = {
  data: {
    data: {
      logs: [],
      totalLogs: 0,
      totalPages: 0,
      currentPage: 0,
    },
  } as unknown as FetchResponse<AuditLogResponse>,
  isLoading: false,
  isValidating: false,
  error: undefined,
  mutate: vi.fn(),
};

describe('useAuditLogs', () => {
  beforeEach(() => {
    mockUseOpenmrsSWR.mockReturnValue(mockResponse);
  });

  it('passes a null key (no fetch) when no filters are set', () => {
    renderHook(() => useAuditLogs(emptyFilters, 0, 20));
    expect(mockUseOpenmrsSWR.mock.calls[0][0]).toBeNull();
  });

  it('builds URL with page and size when a filter is active', () => {
    renderHook(() => useAuditLogs({ ...emptyFilters, entityType: 'org.openmrs.Patient' }, 0, 20));
    const calledUrl = mockUseOpenmrsSWR.mock.calls[0][0] as string;
    expect(calledUrl).toContain('page=0');
    expect(calledUrl).toContain('size=20');
    expect(calledUrl).not.toContain('username');
    expect(calledUrl).not.toContain('startDate');
    expect(calledUrl).not.toContain('endDate');
  });

  it('appends entityType filter when set', () => {
    renderHook(() => useAuditLogs({ ...emptyFilters, entityType: 'org.openmrs.Patient' }, 0, 20));
    const calledUrl = mockUseOpenmrsSWR.mock.calls[0][0] as string;
    expect(calledUrl).toContain('entityType=org.openmrs.Patient');
  });

  it('appends trimmed username filter when set', () => {
    renderHook(() => useAuditLogs({ ...emptyFilters, username: '  admin  ' }, 0, 20));
    const calledUrl = mockUseOpenmrsSWR.mock.calls[0][0] as string;
    expect(calledUrl).toContain('username=admin');
  });

  it('formats startDate as dd/MM/yyyy', () => {
    const date = new Date('2026-03-15');
    renderHook(() => useAuditLogs({ ...emptyFilters, startDate: date }, 0, 20));
    const calledUrl = mockUseOpenmrsSWR.mock.calls[0][0] as string;
    expect(calledUrl).toContain(`startDate=${encodeURIComponent(dayjs(date).format(DATE_FILTER_FORMAT))}`);
  });

  it('formats endDate as dd/MM/yyyy', () => {
    const date = new Date('2026-03-20');
    renderHook(() => useAuditLogs({ ...emptyFilters, endDate: date }, 0, 20));
    const calledUrl = mockUseOpenmrsSWR.mock.calls[0][0] as string;
    expect(calledUrl).toContain(`endDate=${encodeURIComponent(dayjs(date).format(DATE_FILTER_FORMAT))}`);
  });

  it('returns hasActiveFilter=false when no filters set', () => {
    const { result } = renderHook(() => useAuditLogs(emptyFilters, 0, 20));
    expect(result.current.hasActiveFilter).toBe(false);
  });

  it('returns hasActiveFilter=true when entityType filter is set', () => {
    const { result } = renderHook(() => useAuditLogs({ ...emptyFilters, entityType: 'org.openmrs.Patient' }, 0, 20));
    expect(result.current.hasActiveFilter).toBe(true);
  });

  it('does not append username when it is only whitespace', () => {
    renderHook(() => useAuditLogs({ ...emptyFilters, entityType: 'org.openmrs.Patient', username: '   ' }, 0, 20));
    const calledUrl = mockUseOpenmrsSWR.mock.calls[0][0] as string;
    expect(calledUrl).toContain('entityType=org.openmrs.Patient');
    expect(calledUrl).not.toContain('username');
  });

  it('treats a whitespace-only username as no active filter', () => {
    renderHook(() => useAuditLogs({ ...emptyFilters, username: '   ' }, 0, 20));
    expect(mockUseOpenmrsSWR.mock.calls[0][0]).toBeNull();
  });
});
