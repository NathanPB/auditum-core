/*
Rust Toolbox Copyright (C) 2019  Nathan P. Bombana, Lucas Vicari
This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.
This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.
You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/


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
 * Defines the functions that a module must export.
 *
 * @see [ModuleType]
 * @param {string} moduleType - The type of the module.
 * @return {[string]} - The name of the functions that the module must export.
 * @throws {Error} - If the module type is unknown.
 */
const requiredFunctions = (moduleType) => {
  switch (moduleType) {
    case ModuleType.IO: return ['init', 'onRequest', 'onResponse'];
    case ModuleType.SCRAP: return ['init', 'search', 'accept'];
    default: throw new Error(`Unknown module type: ${moduleType}`);
  }
};

/**
 * Checks the structure of a module.
 *
 * To be satisfied, the module must have the exported functions
 * as described in [requiredFunctions].
 *
 * @see [requiredFunctions]
 * @param {ModuleObject} moduleInfo - The module to inspect
 * @return {boolean} - True if the module is valid, false otherwise.
 */
const checkStructure = (moduleInfo) => requiredFunctions(moduleInfo.type)
    .map(fName => moduleInfo.module[fName])
    .map(member => typeof member)
    .every(type => type === 'function');

/**
 * Loads and initializes a module.
 *
 * This function loads a valid [ModulePackageInfo] into a [ModuleObject]
 * and triggers the module's "init" function in the specified main script.
 *
 * It also checks the module structure.
 *
 * @see [checkStructure]
 * @param {ModulePackageInfo} pkgInfo - The data about the module to load.
 * @return {Promise<ModuleObject>} - Resolves into the module object after loaded and initialized.
 * @throws {Error} - If the module structure is not valid.
 * @throws {Error} - If there is some uncaught exception in the module's main script.
 */
const loadModule = async (pkgInfo) => {
  try {
    const moduleObject = {
      ...pkgInfo,
      module: require(pkgInfo.main)
    };

    if (!checkStructure(moduleObject)) {
      throw new Error('Structure not valid');
    }

    moduleObject.module.init();

    return moduleObject;
  } catch (e) {
    throw new Error(`Unable to load module ${pkgInfo.name}: ${e.message}`);
  }
};

module.exports = {
  ModuleType, MODULES_PATH, loadModule
};
