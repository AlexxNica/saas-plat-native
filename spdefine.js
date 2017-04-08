import {Platform} from 'react-native';

let spdefineInternal;
let spModuleId = 100000;
const moduleIds = new Map();

if (Platform.OS === 'android' || Platform.OS === 'ios') {

  spdefineInternal = (moduleName, factory) => {
    let moduleId = spModuleId++;
    moduleIds.set(moduleName, moduleId);
    global.__d(factory, moduleId, null, moduleName);
  };

  global.__require = global.require;
  global.require = global.sprequire = (moduleName) => {
    //console.log(moduleName + ':' + moduleIds.get(moduleName));
    return global.__require(moduleIds.get(moduleName) || moduleName);
  };
}

if (Platform.OS === 'web') {
  spdefineInternal = (moduleName, factory) => {
    let moduleId = spModuleId++;
    moduleIds.set(moduleName, moduleId);
    __webpack_require__.m[moduleId] = (module, exports, require) => {
      debugger
      return factory(global, require, module, exports)
    };
  };
  global.require = global.sprequire = (moduleName) => {
    debugger
    return __webpack_require__(moduleIds.get(moduleName) || moduleName);
  };
}

export default spdefine = global.spdefine = spdefineInternal;
