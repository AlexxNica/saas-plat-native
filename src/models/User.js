import assert from 'assert';
import { observable, computed } from 'mobx';
import Server from './Server';

export default class UserModel {
  store;
  id;
  @observable name = null;
  @observable token = null;
  @observable roles = [];
  @observable servers = [];
  @observable currentServer = null;
  @observable profiles = {};

  constructor(store, id, name, token, roles, servers, profiles, currentServer) {
    assert(store, 'store不能为空');
    assert(id, 'id不能为空');

    this.store = store;
    this.id = id;
    this.name = name;
    this.token = token;
    this.roles = roles || [];
    this.servers = servers || [];
    this.currentServer = currentServer || null;
    this.profiles = profiles || {};
  }

  @computed get server() {
    return this.servers[this.currentServer] || this.servers[0];
  }

  isInRole(...roles) {
    if (arguments.length === 1 && Array.isArray(arguments[0])) {
      roles = arguments[0];
    }
    return roles.filter(role => this.roles.indexOf(role) === -1).length ===
      0;
  }

  hasServerAuth(authCode, serverIn) {
    return this.store.hasServerAuth(authCode, serverIn);
  }

  isServerAdministrator(serverIn) {
    return this.store.isServerAdministrator(serverIn);
  }

  changeServer(serverName) {
    return this.store.changeServer(serverName);
  }

  logout() {
    store.logout();
  }

  toJS() {
    return {
      id: this.id,
      name: this.name,
      roles: this.roles,
      token: this.token,
      profiles: this.profiles,
      servers: this.servers.map(s => s.toJS()),
      currentServer: this.currentServer
    };
  }

  static fromJS(store, object) {
    return new UserModel(store, object.id, object.name, object.token, object.roles,
      (object.servers || []).map(s => Server.fromJS(store, s)), object.profiles,
      object.currentServer);
  }
}
