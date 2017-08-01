import React from 'react';
import { View, Platform } from 'react-native';
import AppRouter from './AppRouter';
import { Router, Route } from '../utils/helper';

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
      {!__DEV__ && (Platform.OS === 'android' || Platform.OS === 'ios') && require('./DebugView')}
    </View>
  );
}
