import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

process.env.TZ = 'UTC';

const r = (relativePath: string) => fileURLToPath(new URL(relativePath, import.meta.url));

export default defineConfig({
  resolve: {
    alias: [{ find: /^.*\.s?css$/, replacement: 'identity-obj-proxy' }],
  },
  test: {
    environment: 'happy-dom',
    globals: true,
    clearMocks: true,
    setupFiles: [r('./tools/setup-tests.ts')],
    exclude: ['**/node_modules/**', '**/e2e/**', '**/dist/**'],
    server: {
      deps: {
        inline: [/@openmrs/],
      },
    },
    coverage: {
      provider: 'v8',
      include: ['**/src/**/*.component.tsx'],
      exclude: ['**/node_modules/**', '**/src/**/*.test.*', '**/src/declarations.d.ts'],
    },
    alias: [
      { find: /^@openmrs\/esm-framework$/, replacement: '@openmrs/esm-framework/mock' },
      { find: 'react-i18next', replacement: r('./__mocks__/react-i18next.js') },
      // Work around the uuid ESM wrapper breaking when vitest inlines @openmrs/esm-offline
      // (same fix as openmrs-esm-patient-chart's shared vitest config).
      { find: /^uuid$/, replacement: r('./node_modules/uuid/dist/index.js') },
    ],
  },
});
