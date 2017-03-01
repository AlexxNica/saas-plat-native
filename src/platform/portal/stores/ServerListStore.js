import {serverStore, userStore, Actions} from 'saasplat-native';
import {observable, action, runInAction} from 'mobx';
import assert from 'assert';

export default class ServerListStore {
  @observable loading;
  @observable loadSuccess = false;
  @observable message;

  @action changeServer = async(server) => {
    assert(server && server.id);

    this.loading = true;
    this.message = '';

    // 要是有服务器，进入上次的服务器
    await serverStore.connectServer(server.id);

    if (serverStore.connectState !== 'Complated') {
      runInAction('after connect server', () => {
        this.loadSuccess = false;
        this.message = serverStore.connectMessage;
      });
      return;
    } else {
      this.loadSuccess = true;
    }

    // 无服务器，提示创建一个
    if (!serverStore.currentServer) {
      Actions.gotoAction('notFoundServer');
      return;
    } else {
      Actions.gotoAction('portal');
    }

    // 进入上次的模块，或进入默认的模块
    let module = serverStore.lastModule;
    if (!module) {
      module = serverStore.defaultModule;
    }

    // 进入模块
    if (module) {
      module.open({type:'replace'});
    } else if (serverStore.modules.length > 0) {
      Actions.gotoAction('moduleList');
    } else {
      Actions.gotoAction('notFoundModule');
    }

    // 最后在loading=false
    runInAction('after connect server', () => {
      this.loading = false;
    });
  }

  @action prepare = async() => {
    if (this.loading === undefined) {
      // 上次退出时的服务器就是defaultServer
      const server = userStore.getDefaultServer();

      this.changeServer(server);
    }
  }

  static getStore() {
    if (!this._instance) {
      this._instance = new ServerListStore();
    }
    return this._instance;
  }
}
