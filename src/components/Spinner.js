import React from 'react';
import {ActivityIndicator} from 'react-native';

export default class Spinner extends React.Component {


  render() {
    if (this.props.visible) {
      return (<ActivityIndicator
        animating={true}
        style={{
        height: 50
      }} size="small" />);
    }
    return null;
  }

}
