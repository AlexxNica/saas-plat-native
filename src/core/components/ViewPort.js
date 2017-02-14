import React from 'react';
import {View} from 'react-native';
import AppView from './AppView';
import DebugView from './DebugView';

export default function ViewPort(props) {
  return (
    <View style={{
      flex: 1
    }}>
      <AppView/>
      {!__DEV__ && <DebugView/>}
    </View>
  );
}
