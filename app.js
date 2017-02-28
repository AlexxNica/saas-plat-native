console.log('Welcome to SaasPlat, more visit www.saas-plat.com.');

import React from 'react';
import {
  View,
  ScrollView,
  Text,
  StatusBar,
  ActivityIndicator,
  Platform,
  NetInfo,
  TouchableOpacity,
  TouchableHighlight,
  StyleSheet,
  AsyncStorage
} from 'react-native';
import SplashScreen from '@remobile/react-native-splashscreen';
import Storage from 'react-native-storage';
import DeviceInfo from 'react-native-device-info';
import config from './config';
import spdefine from './spdefine';

const msgs = {
  Success: '环境准备已就绪。',
  NetworkConnectFailed: '网络尚未连接，建议开启WIFI或3G网络，否则数据无法更新和保存提交。',
  Failed: '应用启动失败，稍后重试...',
  Loading: '正在加载，请稍后... ',
  DevLoading: '获取开发者选项',
  httpRquestTimeout: '网络请求超时',
  httpAccessForbidden: '网络连接已拒绝',

  versionUploading: '开始读取内核版本...',
  versionUploaded: '内核版本读取完成，当前版本:',
  NoVersion: '系统正在维护，稍后重试...',
  versionGetFail: '内核程序版本获取失败',
  versionSyncing: '开始同步内核程序版本...',
  versionSynced: '内核程序版本同步完成',
  versionSaved: '内核最新版本已经保存，版本号:',

  cacheDisable: '系统已经禁用缓存',
  debugMode: '系统已经启用调试模式',

  netInfoChecking: '开始检查网络连接情况...',
  netInfoCheckSuccess: '网络连接成功',
  netInfoCheckFailed: '网络尚未连接',

  fileSyncing: '开始同步内核脚本...',
  fileSynced: '内核脚本下载完成',
  appCoreScriptUploading: '开始读取内核脚本...',
  appCoreScriptUploaded: '内核脚本读取成功',
  appCoreScriptLoadFail: '内核程序脚本下载失败',
  appCoreInvoking: '开始加载内核程序...',
  appCoreInvoked: '内核程序加载成功',
  appCoreRequiring: '开始运行内核程序...',
  appCoreRequireNull: '内核程序加载失败',
  appCoreRequired: '内核程序加载成功'
};

const BASE_CORE = 'core';

const DEV_URL = __DEV__ ? 'http://test.saas-plat.com:8202/app/dev' :
  'http://api.saas-plat.com/app/dev';

let lastGlobalError;
global.devOptions = {
  debugMode: false,
  cacheDisable: false
};

global.__errorHandler = function(err) {
  debugger;
  lastGlobalError = err;
};

function invoke(script) {
  'use strict';
  // todo 暂时使用一个大trycache防止崩溃退出
  let spscript =
    "spdefine('__app__',function(global, require, module, exports) {\n" +
    "require=global.sprequire;" +
    "function __loadcode(){\n" + script + "\n}" + // try调用func减少性能损失
    "try{__loadcode();}catch(err){global.__errorHandler(err);}\n});";
  if (__DEV__) {
    spscript += "\n\nconsole.log('内核程序开始运行');";
  }
  // chrome引擎new function比eval快一倍以上
  (new Function(spscript))();
  //eval(spscript);
}

// 加载平台组件
export default class extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      code: 0,
      animating: true,
      messageList: []
    };

    this.onPress = this.onPressFeed.bind(this);
    this.syncFile = this.syncFile.bind(this);
    this.syncVersion = this.syncVersion.bind(this);
    this.clearMessageList = this.clearMessageList.bind(this);
  }

  finished(code) {
    this.setState({ code: code, animating: false });
    // 成功是不隐藏的，等在platform加载完再隐藏
    if (this.state.code != 200) {
      // 关闭启动画面
      let end = new Date().getTime();
      let dif = end - this._start;
      if (dif > 2000) { // 至少显示2s，要不一闪而过体验不好
        // 恢复状态条
        StatusBar.setHidden(false);
        SplashScreen.hide();
      } else {
        setTimeout(() => {
          // 恢复状态条
          StatusBar.setHidden(false);
          SplashScreen.hide();
        }, dif);
      }
    }
  }

  syncFile({ resolve, reject, id }) {
    const me = this;
    if (!global.isConnected) {
      reject(msgs.netInfoCheckFailed);
      return;
    }
    this.pushMessage(msgs.fileSyncing);
    fetch(
      `${config.bundle}?name=${BASE_CORE}&version=${id}&platform=${Platform.OS}&dev=${__DEV__}`
    ).then((response) => {
      if (response.status == 200)
        return response.text();
      throw msgs.httpAccessForbidden + ' (' + response.status + ')';
    }).then(text => {
      me.pushMessage(msgs.fileSynced);
      if (id != 'HEAD') { // 每次加载最新版不保存
        me.store.save({ key: 'file', id: id, rawData: text });
        me.pushMessage(msgs.fileSaved);
      }
      resolve(text);
    }).catch((error) => {
      if (me.debugMode) {
        me.pushMessage(
          `${config.bundle}?name=${BASE_CORE}&version=${id}&platform=${Platform.OS}&dev=${__DEV__}`
        );
      }
      reject(error);
    });
  }

  syncVersion({ reject, resolve }) {
    const me = this;
    if (!global.isConnected) {
      reject(msgs.netInfoCheckFailed);
      return;
    }
    let timeoutId = __DEV__ ?
      1 :
      setTimeout(function() {
        if (!timeoutId)
          return;
        timeoutId = null;
        reject(msgs.httpRquestTimeout); // reject on timeout
      }, 10000); // 10s超时
    this.pushMessage(msgs.versionSyncing);
    fetch(config.version).then((response) => {
      if (!timeoutId) {
        return;
      }
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      if (response.status == 200)
        return response.json();
      throw msgs.httpAccessForbidden + ' (' + response.status + ')';
    }).then(json => {
      if (!json)
        return;
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      if (json.errno) {
        reject(json.msg);
      } else {
        me.pushMessage(msgs.versionSynced);
        if (json.data.version != 'HEAD') { // HEAD是最新版就不要保存
          me.store.save({ key: 'version', rawData: json.data });
          me.pushMessage(msgs.versionSaved + json.data.version);
        }
        resolve(json.data);
      }
    }).catch(error => {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      if (me.debugMode) {
        me.pushMessage(config.version);
      }
      reject(error);
    });
  }

  loadScript(script) {
    this.pushMessage(msgs.appCoreInvoking);
    try {
      invoke(script);
      this.pushMessage(msgs.appCoreInvoked);
    } catch (err) {
      if (err && global.devOptions.debugMode) {
        this.pushMessage(err.message || err);
      }
      this.pushMessage(msgs.Failed);
      this.finished(500.1);
      return;
    }
    this.pushMessage(msgs.appCoreRequiring);
    let sp = global.require('__app__');
    if (lastGlobalError) {
      if (lastGlobalError && global.devOptions.debugMode) {
        this.pushMessage(lastGlobalError.message || lastGlobalError);
      }
      this.pushMessage(msgs.Failed);
      this.finished(500.2);
      return;
    }
    if (!sp || !sp.App) {
      if (global.devOptions.debugMode) {
        this.pushMessage(msgs.appCoreRequireNull);
      }
      this.pushMessage(msgs.Failed);
      this.finished(500.9);
      return;
    }
    this.pushMessage(msgs.appCoreRequired);
    spdefine('saasplat-native', function(global, require, module, exports) {
      module.exports = sp.__esModule ?
        sp.default :
        sp;
    });
    this.pushMessage(msgs.Success);
    this.finished(200);
    return true;
  }

  loadFile(version) {
    const me = this;
    this.pushMessage(msgs.appCoreScriptUploading);
    if (__DEV__ || global.devOptions.cacheDisable) {
      this.store.remove({ key: 'file', id: version });
    }
    // 如果版本加载成功，开始加载代码
    this.store.load({
      key: 'file',
      id: version,
      syncInBackground: (__DEV__ || global.devOptions.cacheDisable) ?
        false : true
    }).then(ret => {
      me.pushMessage(msgs.appCoreScriptUploaded);
      if (!me.loadScript(ret)) {
        // 当前版本的文件无效，清楚缓存
        me.store.remove({ key: 'file', id: version });
      }
    }).catch(err => {
      //如果没有找到数据且没有同步方法，
      if (err && me.debugMode) {
        //或者有其他异常，则在catch中返回
        me.pushMessage(msgs.appCoreScriptLoadFail + ', ' + (err.message ||
          err));
      }
      // 当前版本已过期删除
      me.store.remove({ key: 'version' });
      me.pushMessage(msgs.Failed);
      me.finished(404);
    });
  }

  loadVersion(autoSync) {
    const me = this;
    this.pushMessage(msgs.versionUploading);
    if (__DEV__ || global.devOptions.cacheDisable) {
      this.store.remove({ key: 'version' });
    }
    // 版本默认每天检查一次，就算过期也是先返回老版本，下次打开才是新版
    this.store.load({
      key: 'version',
      autoSync,
      syncInBackground: (__DEV__ || global.devOptions.cacheDisable) ?
        false : true
    }).then(ret => {
      me.pushMessage(msgs.versionUploaded + ret.version);
      me.loadFile(ret.version);
    }).catch(err => {
      //如果没有找到数据且没有同步方法，
      if (err && me.debugMode) {
        //或者有其他异常，则在catch中返回
        me.pushMessage(msgs.versionGetFail + ', ' + (err.message || err));
      }
      me.pushMessage(msgs.NoVersion);
      me.finished(404);
    });
  }

  pushMessage(message) {
    console.log(message);
    this.setState({ messageList: this.state.messageList.concat(message) });
  }

  loadDevOptions(callback) {
    if (global.isConnected) {
      const deviceID = DeviceInfo.getDeviceId(); // iPhone7,2
      const deviceUUID = DeviceInfo.getUniqueID(); // FCDBD8EF-62FC-4ECB-B2F5-92C9E79AC7F9
      // 联网从平台获取开发者选项
      this.pushMessage(msgs.DevLoading);
      fetch(`${DEV_URL}?did=${deviceID}&uuid=${deviceUUID}`).then((response) => {
        return response.json();
      }).then((json) => {
        if (json.errno) {
          this.pushMessage(json.errmsg);
        } else {
          global.devOptions = { ...global.devOptions, ...json.data };
        }
      }).catch(err => {
        this.pushMessage(err);
      });
    }
    if (global.devOptions.cacheDisable) {
      this.pushMessage(msgs.cacheDisable);
    }
    if (global.devOptions.debugMode) {
      this.pushMessage(msgs.debugMode);
    }
    if (callback){
      callback();
    }
  }

  loadCoreFile() {
    if (global.isConnected) {
      const me = this;
      this.pushMessage(msgs.netInfoCheckSuccess);
      // 如果网络连接，获取最新版本
      this.syncVersion({
        resolve: function({ version }) {
          me.loadFile(version);
        },
        reject: function(err) {
          me.pushMessage(msgs.versionGetFail + ', ' + (err.message ||
            err));
          me.loadVersion(false);
        }
      });
    } else {
      alert(msgs.NetworkConnectFailed);
      this.pushMessage(msgs.netInfoCheckFailed);
      this.loadVersion();
    }
  }

  initEnv() {
    this.store = new Storage({
      size: 1, // 默认保存最近1个版本
      storageBackend: AsyncStorage,
      defaultExpires: (__DEV__ || global.devOptions.cacheDisable) ?
        1 : null, // 永不过期
      autoSync: true,
      syncInBackground: (__DEV__ || global.devOptions.cacheDisable) ?
        false : true,
      sync: {
        file: this.syncFile,
        version: this.syncVersion
      }
    });
  }

  prepare() {
    const me = this;
    this.setState({ code: 0, animating: true });
    this.pushMessage(msgs.netInfoChecking);

    function handleConnected(isConnected) {
      global.isConnected = isConnected;
      if (me.handled) {
        // 网络请求不能关闭，但是这里只需要处理一次
        return;
      }
      me.pushMessage(msgs.Loading);
      me.loadDevOptions(() => {
        me.initEnv();
        me.loadCoreFile();
      });
    }

    function handleFirstConnectivityChange(isConnected) {
      handleConnected(isConnected);
      // NetInfo.isConnected.removeEventListener(
      //   'change',
      //   handleFirstConnectivityChange
      // );
    }
    NetInfo.isConnected.addEventListener('change',
      handleFirstConnectivityChange);
  }

  componentDidMount() {
    this._start = new Date().getTime();
    this.prepare();
    // 调试模式不显示启动画面，直接显示加载过程
    if (global.devOptions.debugMode) {
      // 恢复状态条
      StatusBar.setHidden(false);
      SplashScreen.hide();
    }
  }

  onPressFeed() {
    if (this.state.animating) {
      return;
    }
    this.prepare();
  }



  clearMessageList() {
    this.setState({ messageList: [] });
  }

  render() {
    if (this.state.code === 200) {
      const sp = global.require('__app__');
      const Component = sp.App;
      return <Component/>;
    }
    if (!global.devOptions.debugMode) {
      const messageContent = this.state.messageList.length > 0 ?
        this.state.messageList[this.state.messageList.length - 1] :
        '';
      let lastErrorText = null;
      if (lastGlobalError) {
        lastErrorText = (
          <Text style={styles.messageError}>
          {lastGlobalError}
        </Text>
        );
      }
      return (
        <View style={styles.container}>
          <StatusBar hidden={false} barStyle='default'/>{this.state.animating
            ? <ActivityIndicator animating={true} style={{
              height: 50
            }} size='small' />
            : <View style={{
              height: 50
            }}/>}
          <TouchableOpacity onPress={this.onPressFeed}>
            <View>
              <Text style={[
                styles.message, {
                  marginBottom: lastGlobalError
                    ? 20
                    : 120
                }
              ]}>
                {messageContent + (this.state.code !== 0
                  ? ('(' + this.state.code + ')')
                  : '')}
              </Text>
              {lastErrorText}
            </View>
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <StatusBar hidden={false} barStyle='default'/>
          <ScrollView style={styles.messageList} contentContainerStyle={styles.messageListContainer}>
            {this.state.messageList.map((message, i) => (
              <View key={i} style={styles.row}>
                <TouchableHighlight activeOpacity={0.5} style={styles.rowContent} underlayColor='transparent'>
                  <Text style={styles.rowText}>
                    {message}
                  </Text>
                </TouchableHighlight>
              </View>
            ))}
          </ScrollView>
          <View style={styles.buttons}>
            <TouchableHighlight activeOpacity={0.5} onPress={this.onPressFeed} style={styles.button} underlayColor='transparent'>
              <Text style={[
                styles.buttonText, this.state.animating
                  ? styles.buttonDisabled
                  : null
              ]}>
                重新加载
              </Text>
            </TouchableHighlight>
            <TouchableHighlight activeOpacity={0.5} onPress={this.clearMessageList} style={styles.button} underlayColor='transparent'>
              <Text style={styles.buttonText}>
                清空所有
              </Text>
            </TouchableHighlight>
          </View>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    color: '#111'
  },
  messageError: {
    fontSize: 14,
    color: '#ccc'
  },
  messageList: {
    padding: 15,
    position: 'absolute',
    top: 39,
    left: 0,
    right: 0,
    bottom: 60
  },
  messageListContainer: {},
  buttons: {
    flexDirection: 'row',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0
  },
  button: {
    flex: 1,
    padding: 22
  },
  buttonText: {
    color: '#111',
    fontSize: 14,
    textAlign: 'center'
  },
  buttonDisabled: {
    color: '#ccc'
  },
  row: {
    height: 36,
    marginTop: 1
  },
  rowText: {
    color: '#111',
    fontSize: 16,
    fontWeight: '600'
  },
  rowContent: {
    flex: 1
  }
});
