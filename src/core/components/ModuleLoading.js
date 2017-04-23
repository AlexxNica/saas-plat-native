import React from 'react';
import {View, Text, StatusBar, TouchableOpacity} from 'react-native';
import {autobind} from 'core-decorators';
import Spinner from './Spinner';
import Bundle from '../core/Bundle';
import Router from '../core/Router';
import {connectStyle} from '../core/Theme';
import {translate} from '../core/I18n';

// 模块加载等待
@translate('core.ModuleLoading')
@connectStyle('core.ModuleLoading')
@autobind
export default class ModuleLoading extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      animating: true,
      message: 'ModuleLoading',
      taskId: 0
    };
  }

  componentWillMount() {
    this.prepare(this.props);
  }

  onPressFeed() {
    if (this.state.animating) {
      return;
    }
    this.prepare();
  }

  showBack() {
    this.props.history.replace('/404');
  }

  finished(taskId) {
    this.setState({animating: false, message: 'Success'});
    try {
      if (!this.props.history.replace(this.props.path)) {
        this.setState({animating: false, message: 'ModuleRouteNotRegisterd'});
        this.showBack();
      }
    } catch (err) {
      this.props.t('GotoFailed');
      console.warn(err);
      if (this.state.taskId === taskId) {
        this.setState({animating: false, message: 'ModuleRouteNotRegisterd'});
        this.showBack();
      }
    }
  }

  loadBundle(bundleConfig, taskId) {
    return new Promise((resolve, reject) => {
      this.props.t('BundleLoading');
      Bundle.load(bundleConfig.bundles, bundleConfig.server).then((bundles) => {
        this.props.t('BundleLoadComplated');
        resolve(bundles);
      }).catch((err) => {
        console.warn('load module failed');
        if (this.state.taskId === taskId) {
          this.setState({animating: false, message: 'Failed', messageErr: err});
          this.showBack();
        }
      });
    });
  }

  handleInit(handlers, ns) {
    return new Promise(async(resolve, reject) => {
      await Promise.all(handlers);
    });
  }

  prepare(props) {
    const name = Router.getBundle(props.path);
    if (!name || Bundle.hasLoad(name)) {
      props.history.replace('/404');
      return;
    }
    const bundleConfig = Bundle.getBundle(name);
    if (!bundleConfig) {
      props.history.replace('/404');
      return;
    }
    const taskId = this.state.taskId + 1;
    this.setState({animating: true, messageErr: null, message: 'Loading', taskId});
    this.loadBundle(bundleConfig, taskId).then(() => {
      // 如果模块配置了初始化方法，开始调用 支持promise
      if (this.props.initHandler && this.props.initHandler.length > 0) {
        this.handleInit(this.props.initHandler, this.props.module.name).then(() => {
          this.finished(taskId);
        });
      } else {
        this.finished(taskId);
      }
    });
  }

  render() {
    return (
      <View style={this.props.style.container}>
        <StatusBar hidden={false} barStyle='default'/>
        <Spinner visible={this.state.animating}/>
        <TouchableOpacity onPress={this.onPressFeed}>
          <View>
            <Text style={this.props.style.success}>
              {this.state.messageErr || this.props.t(this.state.message)}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}
