import React, {
  Component,
} from 'react';
import {
  View,
  ActivityIndicatorIOS,
  ProgressBarAndroid,
  Platform
} from 'react-native';

export default class extends React.Component{

  _getSpinner() {
    if (Platform.OS === 'android') {
      return (
        <ProgressBarAndroid
          style={{
            height: 20,
          }}
          styleAttr="Inverse"
          {...this.props}
        />
      );
    } else {
      return (
        <ActivityIndicatorIOS
          animating={true}
          style={{height: 50}}
          size="small"
          {...this.props}
        />
      );
    }
  }

  render() {
    if (this.props.visible)
      return this._getSpinner();
    return (
      <View/>
    );
  }

}
