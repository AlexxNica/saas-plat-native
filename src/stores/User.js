import assert from 'assert';
import sha1 from 'crypto-js/sha1';
import { observable, action } from 'mobx';

import ServerStore from './Server';
import RouterStore from './Router';

import UserModel from '../models/User';
import HistroyModel from '../models/Histroy';

import statistics from '../utils/Statistics';
import localStore from '../utils/LocalStore';

import { tx } from '../utils/internal';
import { registerStore } from '../core/Store';

import * as apis from '../apis/PlatformApis';

@registerStore('userStore')
export default class UserStore {
  @observable loginState;
  @observable user;
  @observable historyList = new HistroyModel();
  @observable options = {};

  getToken() {
    return this.user && this.user.token && this.user.token.data;
  }

  getDefaultServer() {
    return this.user && this.user.server;
  }

  @action logout() {
    // 删除之前的登录状态
    localStore.remove({ key: 'loginState' });
    this.user = null;
  }

  @action login({ username, password, token }) {
    console.log(tx('开始登录'));
    statistics.log({ how: 'login' });
    return new Promise(async(resolve, reject) => {
      if (token) {
        statistics.log({ how: 'sso' });
        try {
          const user = await apis.loginPlatUserToken(token);
          this.changeUser(user);
          console.log(tx('登录完成'));
          resolve(user);
        } catch (err) {
          console.log(tx('登录失败'));
          reject(err);
        }
      } else {
        var encUsername = encodeURIComponent(username) || '';
        var passwordHash = sha1(password).toString();
        try {
          const user = await apis.loginPlatUser(encUsername, passwordHash);
          this.changeUser(user);
          console.log(tx('登录完成'));
          resolve(user);
        } catch (err) {
          console.log(tx('登录失败'));
          reject(err);
        }
      }
    });
  }

  @action changeUser(user) {
    assert(user);
    assert(user.id);
    assert(user.name);
    assert(user.token);

    console.log(tx('切换用户'));
    // 保持当前用户
    this.loginState = this.user = UserModel.fromJS(this, user);

    // 更新历史用户列表
    this.saveLoginState();

    // 保持历史记录和登录状态
    this.historyList.add(this.user);
    this.saveHistoryList();

  }

  @action saveLoginState() {
    if (this.user) {
      console.log('保存登陆状态');
      localStore.save({
        key: 'loginState',
        id: 'loginState',
        rawData: this.user.toJS(),
        expires: (this.user.token && this.user.token.expires) || 1000 *
          3600 * 24 * 7 // 保持一周
      });
    }
  }

  @action saveHistoryList() {
    // 添加历史记录
    console.log(tx('保存登陆历史记录'));
    localStore.save({ key: 'historyList', rawData: this.historyList.toJS() });
  }

  // 恢复最后一次登录的用户状态
  @action loadLoginState(autoLogin = false) {
    console.log(tx('恢复最后一次登录的用户状态'));
    let me = this;
    return new Promise((resolve, reject) => {
      localStore.load({ key: 'loginState', id: 'loginState' }).then((
        result) => {
        console.log(tx('恢复登录状态完成'));
        if (autoLogin) {
          if (me.user) {
            me.logout();
          }
          me.login(result);
        }
        me.loginState = result;
        resolve(result);
      }).catch(err => {
        if (err && err.name !== 'NotFoundError' && err.name !==
          'ExpiredError') {
          console.log(tx('登录状态恢复失败'));
          console.warn(err);
          resolve({});
        } else {
          resolve({});
        }
      });
    });
  }

  @action loadHistoryList(autoLoad = true) {
    console.log(tx('加载登录历史记录'));
    let me = this;
    return new Promise(function(resolve, reject) {
      localStore.load({ key: 'historyList' }).then(result => {
        console.log(tx('加载登录历史记录完成'));
        if (autoLoad) {
          me.historyList.clear();
          (result.items || []).forEach(s => me.historyList.add(
            UserModel.fromJS(me, s)));
        }
        resolve(result || []);
      }).catch(err => {
        if (err && err.name !== 'NotFoundError' && err.name !==
          'ExpiredError') {
          console.log(tx('加载登录历史记录失败'));
          console.warn(err);
          resolve();
        } else {
          resolve();
        }
      });
    });
  }

  // 恢复指定用户的选项设置
  @action loadUserOptions(name, autoUpdate = true) {
    assert(name);
    console.log('恢复用户选项', name);
    const me = this;
    return new Promise(function(resolve, reject) {
      localStore.load({ key: 'useroptions', id: name }).then(result => {
        console.log(tx('用户选项加载完成'));
        if (autoUpdate && me.user) {
          me.options = result;
        }
        resolve(result);
      }).catch(err => {
        if (err && err.name !== 'NotFoundError' && err.name !==
          'ExpiredError') {
          console.log(tx('用户选项加载失败'));
          console.warn(err);
          reject();
        } else {
          if (autoUpdate && me.user) {
            me.options = {};
          }
          resolve();
        }
      });
    });
  }

  @action loadHistory(autoLogin = false) {
    this.loadLoginState(autoLogin).then(loginState => {
      this.loginState = loginState || {};
      if (loginState.name)
        this.loadUserOptions(loginState.name, true);
    });
    this.loadHistoryList();
  }

  @action saveUserOptions() {
    assert(this.user && this.user.name);
    console.log(tx('保存用户选项'), this.user.name);
    localStore.save({ key: 'useroptions', id: this.user.name, rawData: this.options });
  }

  @action setUserOption(options) {
    this.options = {
      ...this.options,
      ...options
    };
    this.saveUserOptions();
  }

  // 是否拥有服务器指定权限，ns默认为当前模块
  @action hasServerAuth(authCode, ns = null) {
    if (!authCode)
      return false;
    ns = ns || (RouterStore.getStore().currentBundle && RouterStore.getStore()
      .currentBundle.name);
    if (!ns) {
      console.warn(tx('当前模块不存在，权限无法判定'));
      return false;
    }
    let module = bundle.getBundle(ns);
    if (!module || !module.spModule || !module.spModule.id)
      return false;
    let moduleID = parseInt(module.spModule.id);
    if (!moduleID)
      return false;
    let authID = parseInt(module.spModule.auth[authCode]);
    if (!authID)
      return false;
    if (authID >= 1000) {
      console.warn('auth code ' + module.name + '/' + authCode + '(' + authID +
        '>1000) is invalid');
    }
    let fullCode = moduleID * 1000 + authID;
    let currentServer = ServerStore.getStore().currentServer;
    let serverAuth = currentServer && currentServer.auth;
    if (!serverAuth.scope)
      return false;
    let scopes;
    // 支持数据和范围
    if (!Array.isArray(serverAuth.scope))
      scopes = [serverAuth.scope];
    else {
      scopes = serverAuth.scope;
    }
    if (!serverAuth.exclude) {
      // 包含
      for (var scope of scopes) {
        return scope.length == 2 ?
          (fullCode >= scope[0] && fullcode <= scope[1]) :
          fullcode == scope;
      }
    } else {
      // 排除法
      for (var scope2 of scopes) {
        if (scope2.length == 2 ?
          (fullCode >= scope2[0] && fullcode <= scope2[1]) :
          fullcode == scope2) {
          return false;
        }
      }
      return true;
    }
  }

  // 是否是企业管理员
  @action isServerAdministrator(serverIn) {
    if (!serverIn) {
      // 没有指定企业取当前所在企业服务器
      let currentServer = ServerStore.getStore().currentServer;
      serverIn = currentServer.name;
    }
    if (!serverIn)
      return false;
    return this.user.isInRole('Server' + serverIn + 'Administrator') > -1;
  }

  @action changeServer(serverName) {
    assert(server);
    if (!this.user || !this.user.servers.find(s => s.name == serverName)) {
      return false;
    }
    this.user.currentServer = serverName;
    return true;
  }

  @action relogin() {
    statistics.log({ how: 'relogin' });
    return new Promise((resolve, reject) => {
      if (!this.loginState.token || !this.loginState.name) {
        reject();
        return;
      }
      this.changeUser(this.loginState);
      console.log(tx('恢复登录完成'));
      resolve(this.user);
    });
  }

  static getStore() {
    if (!this._instance) {
      this._instance = new UserStore();
    }
    return this._instance;
  }
}
