const path = require('path');

const ModuleType = {
  IO: 'io',
  SCRAP: 'scraper'
};

const MODULES_PATH = process.env.AUDITUM_MODULES || path.resolve('modules');

module.exports = {
  ModuleType, MODULES_PATH
};