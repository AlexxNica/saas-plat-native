import React from 'react';
import {View} from 'react-native';
import AppView from './AppView';

export default function ViewPort(props) {
  return (
    <View style={{
      flex: 1
    }}>
      <AppView/>
      {!__DEV__ && (Platform.OS === 'android' || Platform.OS === 'ios') && require('./DebugView')}
    </View>
  );
}
