import { formatDate, formatDatetime, parseDate } from '@openmrs/esm-framework';
import type { TFunction } from 'i18next';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(utc);
dayjs.extend(customParseFormat);

// auditlogweb serializes revision timestamps as dd/MM/yyyy HH:mm:ss in GMT.
export const BACKEND_DATETIME_FORMAT = 'DD/MM/YYYY HH:mm:ss';

const FIELD_LABELS: Record<string, string> = {
  gender: 'Gender',
  birthdate: 'Birth date',
  birthdateEstimated: 'Birth date estimated',
  dead: 'Deceased',
  deathDate: 'Death date',
  deathdateEstimated: 'Death date estimated',
  causeOfDeath: 'Cause of death',
  causeOfDeathNonCoded: 'Cause of death (non-coded)',
  voided: 'Voided',
  voidReason: 'Void reason',
  personVoided: 'Voided',
  personVoidReason: 'Void reason',
  identifier: 'Identifier',
  identifierType: 'Identifier type',
  preferred: 'Preferred',
  givenName: 'Given name',
  middleName: 'Middle name',
  familyName: 'Family name',
  address1: 'Address line 1',
  address2: 'Address line 2',
  cityVillage: 'City / village',
  stateProvince: 'State / province',
  postalCode: 'Postal code',
  country: 'Country',
};

// Java class names the backend reports for entities saved alongside the patient.
const ENTITY_LABEL_KEYS: Record<string, { key: string; fallback: string }> = {
  PersonName: { key: 'entityPersonName', fallback: 'Name' },
  PatientIdentifier: { key: 'entityPatientIdentifier', fallback: 'Identifier' },
  PersonAddress: { key: 'entityPersonAddress', fallback: 'Address' },
  PersonAttribute: { key: 'entityPersonAttribute', fallback: 'Attribute' },
};

const GENDER_LABEL_KEYS: Record<string, { key: string; fallback: string }> = {
  M: { key: 'genderMale', fallback: 'Male' },
  F: { key: 'genderFemale', fallback: 'Female' },
  O: { key: 'genderOther', fallback: 'Other' },
  U: { key: 'genderUnknown', fallback: 'Unknown' },
};

// Fields that carry a calendar date with no meaningful time-of-day component.
const DATE_ONLY_FIELDS = new Set(['birthdate', 'deathDate']);

const ISO_DATETIME = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/;

/** Splits camelCase / snake_case into a capitalised, space-separated label. */
function splitCamelCase(value: string): string {
  const spaced = value
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .trim();
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

export function humanizeFieldName(fieldName: string): string {
  if (FIELD_LABELS[fieldName]) {
    return FIELD_LABELS[fieldName];
  }
  return splitCamelCase(fieldName);
}

/**
 * Turns a raw Java class name (`PersonName`) into something a clinician reads as a thing
 * that changed (`Name`), falling back to the same camel-case split used for field names.
 */
export function humanizeEntityName(simpleName: string, t?: TFunction): string {
  const label = ENTITY_LABEL_KEYS[simpleName];
  if (label) {
    return t ? t(label.key, label.fallback) : label.fallback;
  }
  return splitCamelCase(simpleName);
}

export function formatRevisionDatetime(value: string): string {
  if (!value) {
    return value;
  }
  const parsed = dayjs.utc(value, BACKEND_DATETIME_FORMAT, true);
  return parsed.isValid() ? formatDatetime(parsed.toDate()) : value;
}

/**
 * Renders an audited value for humans. Prefers the backend's resolved `display` (concept,
 * user and location references arrive as `Concept#88` in the raw value), then formats dates,
 * booleans and gender codes so a diff reads as prose rather than storage codes.
 */
export function formatDisplayValue(
  rawValue: string,
  display?: string | null,
  fieldName?: string,
  t?: TFunction,
): string {
  if (display) {
    return display;
  }
  if (!rawValue) {
    return '';
  }
  if (ISO_DATETIME.test(rawValue)) {
    const date = parseDate(rawValue);
    if (date && !Number.isNaN(date.getTime())) {
      return fieldName && DATE_ONLY_FIELDS.has(fieldName) ? formatDate(date) : formatDatetime(date);
    }
  }
  if (rawValue === 'true' || rawValue === 'false') {
    return rawValue === 'true' ? (t?.('yes', 'Yes') ?? 'Yes') : (t?.('no', 'No') ?? 'No');
  }
  if (fieldName === 'gender') {
    const label = GENDER_LABEL_KEYS[rawValue.toUpperCase()];
    if (label) {
      return t ? t(label.key, label.fallback) : label.fallback;
    }
  }
  return rawValue;
}
