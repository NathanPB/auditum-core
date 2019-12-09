const path  = require('path');
const fs = require('fs');
const ModuleType = require('.').ModuleType;
const MODULES_PATH = require('.').MODULES_PATH;

/**
 * Discovers all the possible modules in a certain directory.
 * 
 * A "possible module" is (un)shorthand for directory.
 * 
 * @see [fs.readdirSync]
 * @param modulesDir {string} - The directory to search. Default is [MODULES_PATH].
 * @returns {Promise<string[]>} - The list with the absolute path of all the possible modules.
 */
const discoverModulesInDirectory = async (modulesDir = MODULES_PATH) => {
  return fs.readdirSync(modulesDir).map(it => path.resolve(modulesDir, it));
};

/**
 * Reads a module directory and collects data about the module.
 * 
 * The directory must have a package.json file in its root with
 * the entries "main", "auditum.type" and "auditum.name".
 * The package.json file must be readable.
 * 
 * It will throw exceptions if the conditions above are not satisfied.
 * 
 * @param moduleDir {string} - The directory to search for the module data.
 * @returns {ModulePackageInfo} - The module data.
 * @throws {Error} - If the directory does not contain a readable json-formatted "package.json" file.
 * @throws {Error} - If the found "package.json" file does not contain a "main" entry.
 * @throws {Error} - If the found "package.json" file does not contain a "auditum" entry.
 * @throws {Error} - If the found "package.json" file does not contain a "auditum.name" entry.
 * @throws {Error} - If the found "package.json" file does not contain a "auditum.type" entry.
 */
const readModuleInfo = (moduleDir) => {
  const packageContent = require(path.resolve(moduleDir, 'package.json'));
  const { auditum: auditumData, main: mainScript } = packageContent;
  if(!auditumData) {
    throw new Error('No "auditum" entry found in package.json');
  }

  if(!auditumData.type) {
    throw new Error('No "auditum.type" entry found in package.json');
  }

  if(!auditumData.name) {
    throw new Error('No "auditum.name" entry found in package.json');
  }

  if(!Object.values(ModuleType).includes(auditumData.type)) {
    throw new Error(`Invalid module type ${auditumData.type}`);
  }

  if(!mainScript) {
    throw new Error('No "main" entry found in package.json');
  }

  return({
    ...auditumData,
    main: path.resolve(moduleDir, mainScript)
  });
};

/**
 * Reads a module "package.json" file and checks the access to its main file.
 * 
 * The file provided in the "main" entry must be readable.
 *
 * @see [readModuleInfo]
 * @param moduleDir {string} - The directory to search for the information.
 * @returns {Promise<ModulePackageInfo>} - The object with the package information.
 * @throws {Error} - If the file provided in the "main" entry of the "package.json" file does not exist or is not readable.
 */
const loadModulePackage = async (moduleDir) => {
  const modulePackage =  readModuleInfo(moduleDir);
  
  fs.accessSync(modulePackage.main, fs.constants.R_OK | fs.constants.F_OK);
  return modulePackage;
};

/**
 * Discover all the modules in a specified directory and validate them.
 * 
 * It also logs all the found modules. Being them found or not.
 * 
 * @see discoverModulesInDirectory
 * @see readModuleInfo
 * @see loadModulePackage
 * @param modulesDir {string} - The directory to search for the modules. Default to [MODULES_PATH].
 * @returns {Promise<[ModulePackageInfo]>} - Information about all the valid discovered packages.
 */
const discoverModules = async (modulesDir = MODULES_PATH) => {
  const logLoad = async (dir) => {
    try {
      const pkg = await loadModulePackage(dir);
      console.log(`Discovered module ${pkg.name}`);
      return pkg;
    } catch (e) {
      console.error(`Failed to discover module at ${dir}`);
      console.error(e);
    }
  };
  
  const dirsFound = await discoverModulesInDirectory(modulesDir);
  
  return (await Promise.all(dirsFound.map(logLoad)))
    .filter(it => it);
};

module.exports = discoverModules;