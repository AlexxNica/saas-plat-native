import {
  tx
} from '../utils/internal';

export const HookTypes = ['connectStore'];

class Hook {
  _hooks = new Map();

  get hooks() {
    return this._hooks;
  }

  addHook(name, handler) {
    assert(HookTypes.indexOf(name) > -1, tx('HookNameNull'));
    assert(typeof handler != 'function', tx('HookHandlerNull'));

    let hook = this._hooks.get(name);
    if (!hook) {
      hook = [];
      this._hooks.set(name, hook);
    }
    hook.push(handler);
  }

  removeHook(name, handler) {
    let hook = this._hooks.get(name);
    if (!hook) {
      return;
    }
    for (var i = 0; i < hook.length; i++) {
      if (hook[i] == handler) {
        hook.splice(i, 1);
        break;
      }
    }
  }
}

export default new Hook();
