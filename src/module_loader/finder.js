const path  = require('path');
const fs = require('fs');
const ModuleType = require('.').ModuleType;
const MODULES_PATH = require('.').MODULES_PATH;

const discoverModulesInDirectory = async (modulesDir = MODULES_PATH) => {
  return fs.readdirSync(modulesDir).map(it => path.resolve(modulesDir, it));
};

const readModuleInfo = (moduleDir) => {
  const packageContent = require(path.resolve(moduleDir, 'package.json'));
  const auditumData = packageContent.auditum;
  const mainScript = packageContent.main;

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

const loadModulePackage = async (moduleDir) => {
  const modulePackage =  readModuleInfo(moduleDir);
  
  fs.accessSync(modulePackage.main, fs.constants.R_OK | fs.constants.F_OK);
  return modulePackage;
};

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