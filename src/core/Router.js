import assert from 'assert';
import {tx} from '../utils/internal';

class Router {
  routemap = []
  history;

  init(routes) {
    if (routes && routes.length > 0){
      this.routemap = this.routemap.concat(routes);
    }
  }

  goBack(){
    if (this.history){
      this.history.goBack();
    }else{
      console.warn('history not created');
    }
  }

  push(url){
    if (this.history){
      this.history.push(url);
    }else{
      console.warn('history not created');
    }
  }

  // getBundle(path) {
  //   assert(path, tx('无法查找空路径的路由'));
  //   const ps = path.split('/').filter(item => item);
  //   if (ps.length > 0) {
  //     // 只支持第一级包路由解释
  //     const item = this.routemap.find(item => item.path === ps[0]);
  //     if (!item){
  //       return null;
  //     }
  //     return item.ns;
  //   } else {
  //     return null;
  //   }
  // }

  getPath(ns){
    assert(ns, tx('无法获取无效包的路由'));
    const item = this.routemap.find(item => item.ns === ns);
    if (!item){
      // 如果没有申请路由，就是包命名空间
      return ns;
    }
    return item.path;
  }
}

export default new Router();
