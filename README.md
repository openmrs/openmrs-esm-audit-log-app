# OpenMRS ESM Audit Log App

![OpenMRS CI](https://github.com/openmrs/openmrs-esm-audit-log-app/actions/workflows/ci.yml/badge.svg)

A native O3 frontend for the [auditlogweb](https://github.com/openmrs/openmrs-module-auditlogweb) backend module. This microfrontend ships two features from a single module:

1. **Admin audit log dashboard** — a system-wide audit log viewer at `/openmrs/spa/audit-logs`, linked from the **System Administration** page. Supports filtering by entity type, username, and date range, with expandable field-level before/after diffs.
2. **Patient audit history tab** — an **Audit History** dashboard in the patient chart (`/openmrs/spa/patient/{uuid}/chart/audit-history`) showing every audited revision that touched the patient, newest first, with field-level diffs and related-entity metadata.

Both features integrate purely through `src/routes.json` — the admin card registers into `system-admin-page-card-link-slot`, and the patient tab registers into `patient-chart-dashboard-slot` — so no changes to `openmrs-esm-admin-tools` or `openmrs-esm-patient-chart` are required.

## Backend requirements

- `webservices.rest` ≥ 2.2.0
- [`auditlogweb`](https://github.com/openmrs/openmrs-module-auditlogweb) ≥ 1.1.0-SNAPSHOT, which serves:
  - `GET /ws/rest/v1/auditlogs` (admin dashboard; filters: `entityType`, `username`, `startDate`, `endDate`, `page`, `size`)
  - `GET /ws/rest/v1/auditlogs/entityTypes` (admin dashboard; populates the entity-type filter)
  - `GET /ws/rest/v1/auditlogs/patients` (patient tab; params: `uuid`, `page`, `size`)
- Hibernate Envers must be enabled on the server (`hibernate.integration.envers.enabled=true` in the OpenMRS runtime properties), otherwise the endpoints return empty results.

The patient tab is additionally gated behind the `patient-audit-history` feature flag, which is registered automatically via `optionalBackendDependencies` when the auditlogweb module is detected.

## Privileges

| Feature | Privilege |
|---|---|
| Admin dashboard | `View Audit Logs` |
| Patient audit history tab | `View Audit Logs` |

Both are configurable via the config schema (`adminAuditLog.viewPrivilege` and `patientAuditHistory.viewPrivilege`).

## Local development

```sh
yarn          # install dependencies
yarn start    # openmrs develop — proxies against a dev server
```

To run against a local backend (e.g. an OpenMRS SDK server on port 8080):

```sh
yarn start --backend http://localhost:8080 --port 8082
```

Then open `http://localhost:8082/openmrs/spa/`.

## Tests and checks

```sh
yarn verify        # lint + typescript + tests (what CI runs)
yarn test          # vitest only
yarn build         # production bundle
```

## Project structure

```
src/
├── index.ts                  # app entry: exports all pages/extensions
├── routes.json               # page + extension registrations (the integration surface)
├── config-schema.ts          # merged config schema (adminAuditLog / patientAuditHistory)
├── admin-audit-log/          # system-wide audit log dashboard
└── patient-audit-history/    # patient chart Audit History tab
```
