import {tx} from '../utils/internal';

let enterpriseId;

export default class Tenant {

  static get id() {
    return enterpriseId;
  }

  static register(id) {
    if (!id) {
      throw new Error(501, tx('企业ID不能为空'));
    }
    if (enterpriseId) {
      throw new Error(500, tx('企业ID只能注册一次'));
    }
    enterpriseId = id;
  }
}
