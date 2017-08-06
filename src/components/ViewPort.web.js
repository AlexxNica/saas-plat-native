import React from 'react';
import { View } from 'react-native';
import AppRouter from './AppRouter';
import { RouterComponent as Router, Route } from '../utils/helper';

// ** 这个文件不能删除，web版react-native-web不能require('./DebugView')
export default function ViewPort(props) {
  if (!Router) {
    return null;
  }
  return (
    <View style={{
      flex: 1
    }}>
    <Router>
      {props.children ? props.children : <Route path='/' component={AppRouter}/>}
    </Router>
    </View>
  );
}
