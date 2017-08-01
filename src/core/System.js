import {tx} from '../utils/internal';
import {LoadContextManager} from './Context';

let enterpriseId;

export default class System {

  static get id() {
    return enterpriseId;
  }

  static start(id) {
    if (!id) {
      throw new Error(501, tx('企业ID不能为空'));
    }
    if (enterpriseId) {
      throw new Error(500, tx('企业ID只能注册一次'));
    }
    enterpriseId = id;
    LoadContextManager.getCurrentContext().complateLoad();
    LoadContextManager.destroyCurrentContext();
  }
}
