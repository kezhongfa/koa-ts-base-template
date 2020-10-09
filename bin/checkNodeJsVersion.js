const { checkNodeVersion } = require('fe-team-utils/cjs/check-node-version');
const { engines } = require('../package.json');

checkNodeVersion(engines);
