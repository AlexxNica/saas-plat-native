import assert from 'assert';
import {tx} from '../utils/internal';

class Router {
  routemap = []

  init(routemap) {}

  getBundle(path) {
    assert(path, tx('无法查找空路径的路由'));
    const ps = path.split('/');
    if (ps.length > 0) {
      // 只支持第一级包路由解释
      const item = this.routemap.find(item => item.path === ps[0]);
      if (!item){
        return null;
      }
      return item.ns;
    } else {
      return null;
    }
  }

  getPath(ns){
    assert(ns, tx('无法获取无效包的路由'));
    const item = this.routemap.find(item => item.ns === ns);
    if (!item){
      return null;
    }
    return item.path;
  }
}

export default new Router();
