import React from 'react';
import assert from 'assert';
import {View, StatusBar, Text, TouchableOpacity} from 'react-native';
import {autobind} from 'core-decorators';
import Spinner from './Spinner';
import bundle from '../core/Bundle';
import * as apis from '../apis/PlatformApis';
import {connectStyle} from '../core/Theme';
import {translate} from '../core/I18n';
import {connectStore} from '../core/Store';
import {Actions} from '../core/Router';

// 平台组件加载等待
@translate('core.PlatformLoading')
@connectStyle('core.PlatformLoading')
@connectStore(['userStore', 'systemStore'])
export default class PlatformLoading extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      animating: true,
      message: props.t('loading')
    };
  }

  @autobind
  finished(code) {
    if (this._isMounted) {
      this.setState({animating: false});
      this.setState({
        message: this.props.t(code) || code || this.props.t('failed')
      });
    }
    if (code === 'complated') {
      const appVersion = this.props.systemStore.options.appVersion;
      // console.log(this.props.t('user version:'+appVersion);
      // console.log(this.props.t('system version:'+System.getVersion());
      // 如果没有看过介绍页显示，否着直接进入登录页
      if (!(this.props.systemStore.config.version !== appVersion
        ? Actions.gotoAction('core/showAppIntro', {
          onDone: () => {
            Actions.gotoAction('saas-plat-login');
          }
        })
        : Actions.gotoAction('saas-plat-login'))) {
        debugger;
        this.setState({animating: false, message: this.props.t('loginfailed')});
      }
    }

    if (Platform.OS === 'android' || Platform.OS === 'ios') {
      // 恢复状态条
      StatusBar.setHidden(false);
      require('@remobile/react-native-splashscreen').hide();
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
      console.log(me.props.t('StartFetchPlatform'));
      try {
        const platformConfig = await apis.connectPlatform();
        bundle.removeMetadata('platform');
        bundle.addMetadata('platform', platformConfig.bundles);
        me.props.systemStore.debug(platformConfig.device && platformConfig.device.debug);
        if (platformConfig.bundleServer) {
          me.props.systemStore.updateBundleServer(platformConfig.bundleServer);
        }
        console.log(me.props.t('FetchPlatformSuccess'));
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
      console.log(me.props.t('StartLoadPlatform'));
      bundle.load(platformConfig.bundles, platformConfig.server).then((bundles) => {
        console.log(me.props.t('LoadPlatformSuccess'));
        resolve(bundles);
      }).catch((err) => {
        console.warn(me.props.t('LoadPlatformFail'));
        me.finished(err);
      });
    });
  }

  startupSystem() {
    const me = this;
    me.loadBundle({bundles: bundle.getPreloads('platform'), server: this.props.systemStore.config.platform.bundle}).then((bundles) => {
      me.finished('complated');
    }).catch((err) => {
      console.log(me.props.t('SystemLoadFail'));
      console.warn(err);
      me.finished('bundlefailed');
    });
  }

  prepare() {
    this.setState({animating: true, message: this.props.t('Prepare')});

    this.connect(). // 连接获取平台基本配置信息
    then(() => this.props.systemStore.loadSystemOptions()). // 先加载系统选项，启动过程可能需要判断
    then(() => this.props.userStore.loadHistory()). // 加载登录历史
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
