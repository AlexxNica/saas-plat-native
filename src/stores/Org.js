import {registerStore} from '../core/Store';

import * as apis from '../apis/PlatformApis';

@registerStore('orgStore')
export default class OrgStore {

  static getStore() {
    if (!this._instance) {
      this._instance = new OrgStore();
    }
    return this._instance;
  }
}
