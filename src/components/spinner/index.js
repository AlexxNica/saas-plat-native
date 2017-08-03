import React from 'react';
import { ActivityIndicator } from 'react-native';

export default class Spinner extends React.Component {

  render() {
    if (this.props.visible) {
      return (
        <ActivityIndicator size='small'/>
      );
    }
    return null;
  }

}
