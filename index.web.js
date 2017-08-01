import 'react';
import { AppRegistry } from 'react-native';
import App from './src/App';

global.__DEV__ = __DEV__;
global.__MOCK__ = __MOCK__;

AppRegistry.registerComponent('App', () => App);
AppRegistry.runApplication('App', {
  rootTag: document.getElementById('saas-plat')
});
