let spModuleId = 100000;
const moduleIds = new Map();

const spdefineInternal = (moduleName, factory) => {
  let moduleId = spModuleId++;
  moduleIds.set(moduleName, moduleId);
  __webpack_require__.m[moduleId] = (module, exports, require) => {
    return factory.call(exports, global, global.sprequire, module, exports)
  };
};
global.require = global.sprequire = (moduleName) => {
  if (__DEV__) {
    if (!moduleIds.has(moduleName)) {
      debugger;
      throw `${moduleName} not define`;
    }
  }
  return __webpack_require__(moduleIds.get(moduleName) || moduleName);
};

export default spdefine = global.spdefine = spdefineInternal;
