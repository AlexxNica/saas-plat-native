import assert from 'assert';
import {tx} from '../utils/internal';

class Router {
  routemap = new Map()

  init(routemap) {}

  getBundle(path) {
    assert(path, tx('无法查找空路径的路由'));
    const ps = path.split('/');
    if (ps.length > 0) {
      // 只支持第一级包路由解释
      return this.routemap[ps[0]];
    } else {
      return null;
    }
  }
}

export default new Router();
