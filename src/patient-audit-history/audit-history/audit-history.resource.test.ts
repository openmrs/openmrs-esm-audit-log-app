import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { type FetchResponse, useOpenmrsSWR } from '@openmrs/esm-framework';
import { usePatientAuditHistory } from './audit-history.resource';
import type { PatientAuditLogResponse } from '../types';
import type * as EsmFramework from '@openmrs/esm-framework';

// Keep the project's shared framework mock; only stub the fetching hook under test.
vi.mock('@openmrs/esm-framework', async (importOriginal) => ({
  ...(await importOriginal<typeof EsmFramework>()),
  useOpenmrsSWR: vi.fn(),
}));

const mockUseOpenmrsSWR = vi.mocked(useOpenmrsSWR);

// Only the SWR key and the mapped fields are asserted, so a minimal stand-in is enough.
const asFetchResponse = (data: unknown) => ({ data }) as unknown as FetchResponse<PatientAuditLogResponse>;

describe('usePatientAuditHistory', () => {
  it('builds the patient audit URL and maps the response', () => {
    mockUseOpenmrsSWR.mockReturnValue({
      data: asFetchResponse({
        totalLogs: 2,
        currentPage: 0,
        totalPages: 1,
        logs: [{ revisionID: 1 }, { revisionID: 2 }],
      }),
      error: undefined,
      isLoading: false,
      isValidating: false,
      mutate: vi.fn(),
    });

    const { result } = renderHook(() => usePatientAuditHistory('abc-123', 0, 10));

    expect(mockUseOpenmrsSWR.mock.calls[0][0]).toContain('/auditlogs/patients?uuid=abc-123&page=0&size=10');
    expect(result.current.logs).toHaveLength(2);
    expect(result.current.totalLogs).toBe(2);
    expect(result.current.totalPages).toBe(1);
  });

  it('passes a null SWR key when there is no patient uuid (so no request is made)', () => {
    mockUseOpenmrsSWR.mockReturnValue({
      data: undefined,
      error: undefined,
      isLoading: false,
      isValidating: false,
      mutate: vi.fn(),
    });

    renderHook(() => usePatientAuditHistory('', 0, 10));

    expect(mockUseOpenmrsSWR.mock.calls[0][0]).toBeNull();
  });

  it('returns safe defaults while data is undefined', () => {
    mockUseOpenmrsSWR.mockReturnValue({
      data: undefined,
      error: undefined,
      isLoading: true,
      isValidating: false,
      mutate: vi.fn(),
    });

    const { result } = renderHook(() => usePatientAuditHistory('abc-123', 0, 10));

    expect(result.current.logs).toEqual([]);
    expect(result.current.totalLogs).toBe(0);
    expect(result.current.isLoading).toBe(true);
  });
});
