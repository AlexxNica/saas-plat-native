// utils
import * as Asset from './utils/Asset';
import Statistics from './utils/Statistics';
import * as helper from './utils/helper';
import LocalStore from './utils/LocalStore';

// core
import Bundle from './core/Bundle';
import Registry from './core/Registry';
import {Route, Actions} from './core/Router';
import * as Theme from './core/Theme';
import I18n from './core/I18n';
import * as Store from './core/Store';
import * as Socket from './core/Socket';

// fx
import CommandBus from './fx/CommandBus';
import Query from './fx/Query';

// stores
import UserStore from './stores/User';
import SystemStore from './stores/System';
import ThemeStore from './stores/Theme';
import I18nStore from './stores/I18n';
import RouterStore from './stores/Router';
import MessageStore from './stores/Message';
import ServerStore from './stores/Server';

// app
import AppCls from './App';

export const App = AppCls;

export default {
  // stores
  userStore : UserStore.getStore(), // 用户参数
  systemStore : SystemStore.getStore(), // 系统参数
  themeStore : ThemeStore.getStore(), // 主题
  i18nStore : I18nStore.getStore(), // 多语言
  routerStore : RouterStore.getStore(), // 路由
  messageStore : MessageStore.getStore(), // 消息服务
  serverStore : ServerStore.getStore(), // 服务器

  // core
  Bundle,
  I18n,
  Theme,
  Store,
  Registry, // 注册模块
  Route, // 注册路由
  Actions, // 路由跳转
  Socket,  // 即时通讯

  // fx
  CommandBus,
  Query,

  // utils
  Asset, // 资源
  Statistics, // 统计报表,
  LocalStore, // 本地缓存
  ...helper // 工具类
};
