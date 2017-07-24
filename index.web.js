import 'react';
import { AppRegistry } from 'react-native';
import { AppRegistry as AppLoader } from './main';

global.__DEV__ = __DEV__;

AppRegistry.registerComponent('App', AppLoader.appLoader);
AppRegistry.runApplication('App', {
  rootTag: document.getElementById('saas-plat')
});
