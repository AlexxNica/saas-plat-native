import {Router as FluxRouter, Scene as FluxScene, Actions as FluxActions, Reducer, DefaultRenderer as FluxDefaultRenderer} from 'react-native-router-flux';
import assert from 'assert';
import React from 'react';
import {observer} from 'mobx-react/native';
import bundle from './Bundle';

import RouterStore from '../stores/Router';
import ServerStore from '../stores/User';

import statistics from '../utils/Statistics';
import {tx} from '../utils/internal';

import config from '../config';

export const Scene = FluxScene;
export const DefaultRenderer = FluxDefaultRenderer;

export const Actions = class {
  static error(props) {
    return this.gotoAction('core/failed', props);
  }

  static pop() {
    return FluxActions.pop();
  }

  static refresh(props) {
    return FluxActions.refresh(props);
  }

  static root(props) {
    return FluxActions.root(props);
  }

  /*
  goto有4中情况
  1：平台方法直接写actionname
  2：模块方法，需要先写modulename/actionname
  3：模块内方法，直接写actionname
  4：模块跳转，直接写modulename(actionname默认index)
  */
  static gotoAction(action, props, version) {
    assert(action, 'action未知');
    // 模块跳转
    let curBundle = bundle.getBundle(action);
    let name;
    if (curBundle) {
      name = 'index';
    }
    // 模块内方法
    if (!curBundle && action.indexOf('/') > 0) {
      // 可能包含Bundle/action
      const path = action.split('/');
      const pnames = [];
      for (const item of path) {
        pnames.push(item);
        curBundle = bundle.getBundle(pnames.join('/'));
        if (curBundle) {
          break;
        }
      }
      if (curBundle) {
        name = path.splice(pnames.length, path.length - pnames.length).join('/');
      }
    }
    let lastEntryBundle = this.lastEntryBundle;
    // 平台方法
    if (!curBundle) {
      const fluxAct = FluxActions[action];
      if (typeof fluxAct !== 'function' && !lastEntryBundle) { // 如果进入了子模块需要检查是否是子模块action
        debugger;
        console.warn(action + tx('RouterNotFound'));
        return false;
      }
      if (typeof fluxAct === 'function') {
        fluxAct(props);
        lastEntryBundle = null;
        return true;
      }
    }
    // 模块内方法
    if (!curBundle) {
      curBundle = lastEntryBundle;
      if (curBundle) {
        name = action;
      }
    }
    if (!curBundle) {
      debugger;
      console.warn(action + tx('RouterNotFound'));
      return false;
    }
    // 开始加载模块并切换场景
    if (bundle.hasLoaded(curBundle)) {
      // root scene的root可以省略
      const actname = curBundle.name + '/' + name;
      const fluxAct = FluxActions[actname];
      if (typeof fluxAct !== 'function') {
        debugger;
        console.warn(action + tx('RouterNotFound'));
        return false;
      }
      fluxAct(props);
      this.lastEntryBundle = curBundle;
      return true;
    }
    // 显示模块加载界面
    FluxActions['core/loadModule']({
      module: curBundle,
      initHandler: [...(bundle.initMethods[curBundle.name] || [])],
      // type: props.type ,  // 不要设置默认值 title: curBundle.title || curBundle.name,
      bundleConfig: {
        bundles: [curBundle],
        server: ServerStore.getStore().bundleServer || config.platform.bundle
      },
      action,
      actionParam: props
    });
    return true;
  }

  static _callback(action, props) {
    return this.gotoAction(action, props);
  }

  static createCallback(action) {
    return this._callback.bind(this, action);
  }
};

@observer
export const Router = class extends React.Component {
  sceneWarpComponents = new Map();
  actionKeys = [];

  // findOrCreateWarpComponent(key, creator) {   let WarpComponent =
  // this.sceneWarpComponents.get(key);   if (!WarpComponent) {     WarpComponent
  // = creator(); this.sceneWarpComponents.set(key, WarpComponent);   }   return
  // WarpComponent; }

  cloneElement(scene, props, children) {
    // router flux 里面有个children的判断，必须是不存在的
    for (const p in props) {
      if (props.hasOwnProperty(p) && props[p] === undefined) {
        delete props[p];
      }
    }

    if (children && children.length > 0) {
      return React.cloneElement(scene, props, children);
    } else {
      return React.cloneElement(scene, props);
    }
  }

  buildScene(scene, state, style, ns) {
    assert(scene, '路由查找失败');
    if (!ns) {
      // 删除所有已经注册的action要不会导致删除的scene还有action
      this.actionKeys.forEach((key) => {
        delete FluxActions[key];
      });
      this.actionKeys.length = 0;
    }
    ns = ns || ['core'];
    let scenes = [];
    React.Children.forEach(scene.props.children, (item) => {
      scenes.push(this.buildScene(item, state, style, ns));
    });
    // 改必须标记routeRegisterUniqueKey才可以扩展
    if (scene.props.routeRegisterUniqueKey) {
      // 支持routeRegisterUniqueKey，简化路由注册写法保证了更新不影响其他模块
      const registrys = state.get(scene.props.routeRegisterUniqueKey) || [];
      registrys.forEach(({route, handler, ns}) => {
        const k = ns.split('/');
        const v = typeof route === 'function'
          ? route()
          : route;
        if (!v) {
          return;
        }
        let handleScenes = [];
        if (Array.isArray(v)) {
          for (const routeitem of v) {
            handleScenes.push(this.buildScene(routeitem, state, style, k));
          }
        } else {
          handleScenes.push(this.buildScene(v, state, style, k));
        }
        if (typeof handler === 'function') {
          handleScenes = handler(handleScenes);
        }
        scenes = scenes.concat(handleScenes);

      });
    }
    const key = ns.join('/') + '/' + scene.key;
    this.actionKeys.push(key);
    return this.cloneElement(scene, {
      key,
      bundleName: ns.join('.'),
      navigationBarStyle: scene.props.navigationBarStyle || style.base.navigationBar,
      // 禁止滑动返回上一页
      panHandlers: scene.props.panHandlersEnabled && scene.props.panHandlers,
      // 需要保证重新buildscene时组件不要销毁 component: scene.props.component &&
      // this.findOrCreateWarpComponent(key, () => {   //
      // 这里改成需要每个组件自己connect主题、i18n、store   return   // translate([fullname])(   //
      // connectStyle(fullname)(   //     connectStore(fullname)( this.connectProps({
      // Actions    })(scene.props.component)       // ))) })
    }, scenes);
  }

  // 重新了reducer是因为现在router里的bug，以后可以去掉
  reducer({initialState, scenes}) {
    const base = Reducer({initialState, scenes});
    return (stateParam, actionParam) => {
      if (actionParam.type === 'REACT_NATIVE_ROUTER_FLUX_FOCUS') {
        console.log(tx('SceneFocus') + (actionParam.key || (actionParam.scene && actionParam.scene.name)));
      }
      // console.log(   `${actionParam.type} ${actionParam.key|| (actionParam.scene &&
      // actionParam.scene.name) || ''} scene` );
      if (actionParam.type === 'focus') {
        // 记录页面埋点
        statistics.log({
          how: actionParam.type,
          what: actionParam.key || (actionParam.scene && actionParam.scene.name)
        });
      }
      // 重新刷新一下scenes
      if (stateParam) {
        stateParam.scenes = scenes;
      }

      const state = base(stateParam, actionParam);
      // debugger; 有可能不在子节点下
      return state;
    };
  }

  render() {
    const scenes = this.buildScene(this.props.children, RouterStore.getStore().scenes, this.props.style);
    return (<FluxRouter scenes={FluxActions.create(scenes)} createReducer={this.reducer}/>);
  }
};
