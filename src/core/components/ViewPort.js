import React from 'react';
import {View} from 'react-native';
import AppRouter from './AppRouter';

export default function ViewPort(props) {
  return (
    <View style={{
      flex: 1
    }}>
      <AppRouter/>
      {!__DEV__ && (Platform.OS === 'android' || Platform.OS === 'ios') && require('./DebugView')}
    </View>
  );
}
