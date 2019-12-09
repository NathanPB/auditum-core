const path = require('path');

/**
 * @typedef RequiredModuleObject
 *
 * The actual exported structure of an Auditum NodeJS module's main script.
 *
 * @type {function | {onRequest: function, onResponse, function}}
 */

/**
 * @typedef ModulePackageInfo
 * @type {{name: string, type: string, main: string}}
 *
 * @property name {string} - The name of the module.
 * @property type {string} - The type of the module.
 * @property main {string} - The absolute path to the start script of the module.
 */

/**
 * @typedef ModuleObject
 *
 * The complete structure of an Auditum module.
 *
 * @type {{ ...ModulePackageInfo, module: RequiredModuleObject }}
 */

/**
 * The available module types.
 *
 * @type {{SCRAP: string, IO: string}}
 */
const ModuleType = {
  IO: 'io',
  SCRAP: 'scraper'
};

/**
 * The default directory where the modules are located.
 *
 * It has the value of the environmental variable "AUDITUM_MODULES".
 * If that environmental variable is not found, then the
 * directory used is "modules" relative to the pwd
 *
 * ```${pwd}/modules```
 *
 * E.g.: ``/home/guest/auditum/modules``
 * Where "/home/guest/auditum" is the pwd
 *
 * @type {string}
 */
const MODULES_PATH = process.env.AUDITUM_MODULES || path.resolve('modules');

/**
 * Checks the structure of a module. The input object
 *
 * To be satisfied, those conditions must be satisfied:
 * - Case of Scraper module:
 *   - It must export a function named "onRequest";
 *   - It must export a function named "onResponse".
 *
 * - Case of IO module:
 *   - It must be a function.
 *
 * @param moduleInfo {ModuleObject} - The module to inspect
 * @returns {boolean} - True if the module is valid, false otherwise.
 * @throws {Error} - If the input parameter is not satisfied.
 * @throws {Error} - If the module type is unknown.
 */
const checkStructure = (moduleInfo) => {
  switch (moduleInfo.type) {
    case ModuleType.IO: return (
      typeof moduleInfo.module.onRequest === 'function' &&
      typeof moduleInfo.module.onResponse === 'function'
    );
    case ModuleType.SCRAP: return typeof moduleInfo.module === 'function';
    default: throw new Error(`Unknown module type: ${moduleInfo.type}`);
  }
};

module.exports = {
  ModuleType, MODULES_PATH
};