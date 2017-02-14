import React from 'react';
import {View, Text, StatusBar, TouchableOpacity} from 'react-native';
import {autobind} from 'core-decorators';
import Spinner from './Spinner';
import bundle from '../core/Bundle';
import {connectStyle} from '../core/Theme';
import {translate} from '../core/I18n';
import {Actions} from '../core/Router';

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
    Actions.refresh({hideNavBar: false, title: this.props.t('ModuleLoadFailed')});
  }

  finished(actionConfig, taskId) {
    this.setState({animating: false, message: 'Success'});
    try {
      if (!Actions.gotoAction(actionConfig.action, {
        type: 'replace',
        ...actionConfig.param
      })) {
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
      bundle.load(bundleConfig.bundles, bundleConfig.server).then((bundles) => {
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
    const bundleConfig = props.bundleConfig;
    const actionConfig = {
      action: props.action,
      param: props.actionParam
    };
    const taskId = this.state.taskId + 1;
    if (bundleConfig) {
      this.setState({animating: true, messageErr: null, message: 'Loading', taskId});
      this.loadBundle(bundleConfig, taskId).then(() => {
        // 如果模块配置了初始化方法，开始调用 支持promise
        if (this.props.initHandler && this.props.initHandler.length > 0) {
          this.handleInit(this.props.initHandler, this.props.module.name).then(() => {
            this.finished(actionConfig, taskId);
          });
        } else {
          this.finished(actionConfig, taskId);
        }
      });
    } else {
      this.setState({animating: false, message: 'NoBundle'});
    }
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
