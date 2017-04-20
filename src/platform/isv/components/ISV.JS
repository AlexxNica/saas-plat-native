import React from 'react';
import {
  View,
} from 'react-native';
import assert from 'assert';
import {Route} from 'saasplat-native';

import RegisterISV from './RegisterISV';

export default class ISV extends React.Component{
  constructor(props) {
      super(props);
  }

  render(){
    return (
      <View >

        <Route path='register' component={RegisterISV} title='申请服务商ISV' />
      </View>
    );
  }
}
