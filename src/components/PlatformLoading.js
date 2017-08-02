import React from 'react';
import {View, StatusBar, Text, TouchableOpacity, Platform} from 'react-native';
import {autobind} from 'core-decorators';
import Spinner from './Spinner';
import Bundle from '../core/Bundle';
import Router from '../core/Router';
import * as apis from '../apis/PlatformApis';
import {connectStyle} from '../core/Theme';
import {translate} from '../core/I18n';
import {connectStore} from '../core/Store';
import Startup from '../core/Startup';

import {observer} from '../utils/helper';

// 平台组件加载等待
@translate('core.PlatformLoading')
@connectStyle('core.PlatformLoading')
@connectStore(['userStore', 'systemStore', 'moduleStore'])
@observer
export default class PlatformLoading extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      animating: true,
      message: props.t('正在准备环境，请稍后...')
    };
  }

  hideSplashScreen() {
    if (Platform.OS === 'web') {
      const el = document.getElementById('sp-loading');
      el.parentNode.removeChild(el);
    } else {
      require('@remobile/react-native-splashscreen').hide();
    }
  }

  @autobind
  finished(code, message) {
    if (this._isMounted) {
      this.setState({animating: false});
      this.setState({
        message: message || this.props.t('环境尚未准备就绪，稍后重试...(500)')
      });
    }


    this.hideSplashScreen();
    if (Platform.OS === 'android' || Platform.OS === 'ios') {
      // 恢复状态条
      StatusBar.setHidden(false);
    }

    if (this.props.onComplated) {
      this.props.onComplated(code);
    }

    if (code === 'complated') {
      const appVersion = this.props.systemStore.options.appVersion;
      // console.log(this.props.t('user version:'+appVersion);
      // console.log(this.props.t('system version:'+System.getVersion());
      // 如果没有看过介绍页显示，否着直接进入登录页
      try {
        (this.props.systemStore.config.version === appVersion || (global.devOption && global.devOptions.debugMode)) && this.props.location.pathname === '/' && this.props.history.replace('/login')
      } catch (err) {
        debugger;
        console.warn(err);
        if (this._isMounted) {
          if (Platform.OS === 'web') {
            this.setState({animating: false, message: this.props.t('系统无法登录，请刷新后重试~(500.2)')});
          } else {
            this.setState({animating: false, message: this.props.t('系统无法登录，请完全退出应用稍后重试~(500.2)')});
          }
        }
      }
    }
  }

  componentWillMount() {
    this._isMounted = true;
  }

  componentDidMount() {
    this.prepare();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  connect() {
    const me = this;
    return new Promise(async(resolve, reject) => {
      console.log(me.props.t('开始连接平台网络...'));
      try {
        const platformConfig = await apis.connect(Startup.id) || {};
        // Bundle.removeMetadata('platform');
        // Bundle.addMetadata('platform', platformConfig.bundles);
        Router.init(platformConfig.routes);
        me.props.systemStore.debug(platformConfig.device && platformConfig.device.debug);
        console.log(me.props.t('连接平台完成'));
        resolve(platformConfig);
      } catch (err) {
        me.finished(err);
        reject();
      }
    });
  }

  loadBundle(platformConfig) {
    const me = this;
    return new Promise((resolve, reject) => {
      console.log(me.props.t('开始加载平台模块...'));
      Bundle.load(platformConfig.bundles).then((bundles) => {
        console.log(me.props.t('加载平台模块完成'));
        resolve(bundles);
      }).catch((err) => {
        console.warn(me.props.t('加载平台模块失败'));
        me.finished(err);
      });
    });
  }

  startupSystem() {
    const me = this;
    // me.loadBundle({bundles: Bundle.getPreloads('platform')}).then((bundles) => {
      me.finished('complated', this.props.t('环境准备已就绪~'));
    // }).catch((err) => {
    //   console.log(me.props.t('加载平台失败'));
    //   console.warn(err);
    //   me.finished('bundlefailed', this.props.t('系统加载失败，请稍后重试~(500.2)'));
    // });
  }

  prepare() {
    this.setState({animating: true, message: this.props.t('正在准备环境，请稍后...')});

    this.connect(). // 连接获取平台基本配置信息
    then(() => this.props.systemStore.loadSystemOptions()). // 先加载系统选项，启动过程可能需要判断
    then(() => this.props.userStore.loadHistory()). // 加载登录历史
    then(() => this.props.moduleStore.loadModules()). // 加载功能模块
    then(() => this.startupSystem.bind(this)()); // 启动系统
  }

  @autobind
  onPressFeed() {
    if (this.state.animating) {
      return;
    }
    this.prepare();
  }

  render() {
    return (
      <View style={this.props.style.container}>
        {(Platform.OS === 'android' || Platform.OS === 'ios')
          ? <StatusBar hidden={false} barStyle='default'/>
          : null}
        <Spinner visible={this.state.animating}/>
        <TouchableOpacity onPress={this.onPressFeed}>
          <View>
            <Text style={this.props.style.success}>
              {this.state.message}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}
