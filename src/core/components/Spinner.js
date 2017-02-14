import React from 'react';
import {ActivityIndicator, ProgressBarAndroid, Platform} from 'react-native';

export default class Spinner extends React.Component {

  _getSpinner() {
    if (Platform.OS === 'android') {
      return (<ProgressBarAndroid
        style={{
        height: 20
      }}
        styleAttr="Inverse"
        {...this.props}/>);
    } else {
      return (<ActivityIndicator
        animating={true}
        style={{
        height: 50
      }}
        size="small"
        {...this.props}/>);
    }
  }

  render() {
    if (this.props.visible) {
      return this._getSpinner();
    }
    return null;
  }

}
