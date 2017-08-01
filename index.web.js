import 'react';
import { AppRegistry } from 'react-native';
import App from './src/App';

global.__DEV__ = __DEV__;
module.exports = require('./src');

AppRegistry.registerComponent('App', () => App);
AppRegistry.runApplication('App', {
  rootTag: document.getElementById('saas-plat')
});
