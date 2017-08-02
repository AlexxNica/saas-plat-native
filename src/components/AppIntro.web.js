import React, {Component} from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import assert from 'assert';
import {autobind} from 'core-decorators';
import {connectStore} from '../core/Store';
import { connectStyle } from '../core/Theme';
import {translate} from '../core/I18n';

@translate('core.AppIntro')
@connectStore(['systemStore'])
@connectStyle('core.AppIntro')
@autobind
export default class AppIntroView extends Component {
  handleDone() {
    this.props.systemStore.setSystemOption({appVersion: this.props.systemStore.config.version});
    this.props.history.replace('/login');
  }

  render() {
    return (
      <View>
        <Text>
          {this.props.t('系统新功能介绍')}
        </Text>

        <TouchableOpacity onPress={this.handleDone} style={this.props.style.button}>
	       <View>
            <Text>
              {this.props.t('跳过')}
            </Text>
          </View>
      	</TouchableOpacity>
      </View>
    );
  }
}
