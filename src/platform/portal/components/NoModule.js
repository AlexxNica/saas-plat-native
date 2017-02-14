import React from 'react';
import {autobind} from 'core-decorators';
import {View, Text} from 'react-native';
import {connectStore, connectStyle, translate} from 'saasplat-native';

@translate('NoModuleLocales')
@connectStyle('NoModuleTheme')
@connectStore({appStore: 'NoModuleStore'})
@autobind
export default class NoModule extends React.Component {

  render() {
    return (
      <View style={this.props.style.container}>
        <View>
          <Text style={this.props.style.msg}>
            {this.props.t('NoModules')}
          </Text>
        </View>
      </View>
    );
  }
}
