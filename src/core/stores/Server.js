import assert from 'assert';
import {observable, action, runInAction} from 'mobx';
import {Settings} from 'react-native';
import {registerStore} from '../core/Store';
import {Actions} from '../core/Router';
import bundle from '../core/Bundle';
import * as apis from '../apis/PlatformApis';
import * as sapis from '../apis/ServerApis';
import {tx} from '../utils/internal';
import ModuleModel from '../models/Module';

@registerStore('serverStore')
export default class ServerStore {
  @observable connectState; // Finding Connecting Openning Failed  Conmplated
  @observable connectMessage;
  @observable currentServer;

  @observable bundleServer;

  @observable modules = [];
  @observable currentModule;
  @observable lastModule;
  @observable defaultModule;

  @action openModule(moduleName, viewName, options) {
    assert(moduleName);
    if (typeof viewName !== 'string') {
      viewName = null;
      options = viewName;
    }
    const module = this.modules.find(m => m.name === moduleName);
    if (!module) {
      console.warn(tx('ModuleNotExists'));
      return;
    }
    const view = module.views.find(v => !viewName || v.name === viewName);
    if (!view) {
      console.warn(tx('ViewNotExists'));
      return;
    }
    Actions.gotoAction(view.url, {
      ...options,
      module,
      view
    });
  }

  saveModuleToLocal() {}

  loadModuleFromLocal() {}

  @action connectServer = async(id) => {
    assert(id, tx('ServerIdNull'));
    this.connectState = 'Finding';
    try {
      const serverConfig = await apis.findServer(id);
      console.log(tx('FindServerComplated'));
      await this.connect(serverConfig);
    } catch (error) {
      runInAction('after fetch', () => {
        this.connectState = 'Failed';
        console.log(tx('FindServerFailed'));
        this.connectMessage = error;
      });
    }
  }

  @action connect = async(serverConfig) => {
    assert(serverConfig, tx('ServerConfigNull'));
    if (!serverConfig.address) {
      console.log(tx('ServerAddressNull'));
      return;
    }
    const server = {
      ...serverConfig
    };
    delete server.bundles;
    delete server.modules;
    delete server.bundleServer;
    this.currentServer = server;
    this.connectState = 'Connecting';
    let serverInfo;
    try {
      // 先连接主机测试是否联通
      serverInfo = await sapis.testServer();
      console.log(tx('ServerConnectComplated'));
    } catch (error) {
      console.warn(tx('ServerConnectFailed'));
      runInAction('after fetch', () => {
        this.connectState = 'Failed';
        this.connectMessage = error;
      });
      return;
    }

    // 如果不是调试模式，从平台读取安装模块
    const {
      bundles,
      bundleServer,
      modules,
      ...serConfig
    } = serverInfo;
    let serverDebugs = {};
    if (Settings.get('debugMode')) {
      serverDebugs = {
        modules,
        bundles,
        bundleServer
      };
      if (serverDebugs.modules === undefined) {
        delete serverDebugs.modules;
      }
      if (serverDebugs.bundles === undefined) {
        delete serverDebugs.bundles;
        delete serverDebugs.bundleServer;
      }
    }
    await this.open({
      ...serConfig,
      ...serverConfig,
      ...serverDebugs
    });
  }

  @action open = async(server) => {
    assert(server, 'server is null');
    this.connectState = 'Openning';
    console.log(tx('ServerOpenning'));
    bundle.removeMetadata('server');
    bundle.addMetadata('server', server.bundles);
    console.log(tx('ServerOpened'));
    runInAction('after fetch', () => {
      this.modules = (server.modules || []).map(json => ModuleModel.fromJS(this, json));
      if (server.defaultModule) {
        this.defaultModule = this.modules.find(module => module.id === server.defaultModule);
      } else if (this.modules.length > 0) {
        this.defaultModule = this.modules[0];
      } else {
        this.defaultModule = null;
      }
      this.loadModuleFromLocal();
    });
    try {
      this.bundleServer = server.bundleServer;
      await bundle.load(bundle.getPreloads('server'), server.bundleServer);
      console.log(tx('ServerModuleLoaded'));
      this.connectState = 'Complated';
    } catch (err) {
      this.connectState = 'Failed';
      console.warn(tx('ServerModuleFailed'));
      this.connectMessage = err;
    }
  }

  static getStore() {
    if (!this._instance) {
      this._instance = new ServerStore();
    }
    return this._instance;
  }
}
