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

// 消息提示
export default class MessageView extends React.Component {

  @autobind
  onPressFeed() {
    Actions.pop();
  }

  getTipMsg() {
    let tipMsg = (this.props.msg || '迷路了吗？') + '，返回上一页。';
    switch (this.props.code) {
      case 'ModuleNotExists':
        tipMsg = '导航页面不存在啦~~~戳我返回上一页。';
        break;
      case 'AuthenticationFailed':
        tipMsg = '尚未登录无法访问当前页面哦~戳我返回上一页。';
        break;
      case 'ServerAddressNotLoaded':
        tipMsg = '服务器地址尚未加载成功，点我可以尝试退出重新登录试试。';
        break;
      case 'ServerLoadFailed':
        tipMsg = '门户页配置错误，无法打开啦，点我进入管理控制台调整~。';
        break;
      case 'BaseLoadFailed':
        tipMsg = '平台组件加载失败，请联系您专属运维工程师解决[Phone:' + config.support.phone + ']~。';
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
