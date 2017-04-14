import React, {Component} from 'react';
import {
  View,
  Text,
  Platform,
  StatusBar,
  TouchableOpacity,
  ToolbarAndroid
} from 'react-native';
import {autobind} from 'core-decorators';
import {Actions} from '../core/Router';
import { tx } from '../utils/internal';

// 消息提示
export default class MessageView extends React.Component {

  @autobind
  onPressFeed() {
    Actions.pop();
  }

  getTipMsg() {
    let tipMsg = (this.props.msg || tx('迷路了吗？')) + tx('，返回上一页。');
    switch (this.props.code) {
      case 'ModuleNotExists':
        tipMsg = tx('导航页面不存在啦~~~戳我返回上一页。');
        break;
      case 'AuthenticationFailed':
        tipMsg = tx('尚未登录无法访问当前页面哦~戳我返回上一页。');
        break;
      case 'ServerAddressNotLoaded':
        tipMsg = tx('服务器地址尚未加载成功，点我可以尝试退出重新登录试试。');
        break;
      case 'ServerLoadFailed':
        tipMsg = tx('门户页配置错误，无法打开啦，点我进入管理控制台调整~。');
        break;
      case 'BaseLoadFailed':
        tipMsg = tx('平台组件加载失败，请联系您专属运维工程师解决[Phone:') + config.support.phone + tx(']~。');
        break;
    }
    return tipMsg;
  }

  renderToolbar() {
    return (<ToolbarAndroid onIconClicked={this.onPressFeed} style={this.props.style.toolbar} title={this.props.t('MessageTitle')}/>);
  }

  render() {
    return (
      <View style={this.props.style.page} title={this.props.t('MessageTitle')}>
        <StatusBar hidden={false} barStyle='default'/>
        <View style={this.props.style.container}>
          <TouchableOpacity onPress={this.onPressFeed}>
            <View>
              <Text style={this.props.style.error}>{this.getTipMsg()}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
