const config = require('openmrs/default-rspack-config');

// @openmrs/esm-patient-common-lib is published as TypeScript source (no dist),
// so it must be transpiled along with this app's own sources. In the
// patient-chart monorepo it escapes the node_modules exclusion by being a
// symlinked workspace; installed from npm it does not.
config.scriptRuleConfig.exclude = /node_modules[\\/](?!@openmrs[\\/]esm-patient-common-lib)/;

module.exports = config;
