import React from 'react';
import { AppRegistry } from 'react-native'
import App from './app';
import './spdefine';
import './bundles';

global.__DEV__ = __DEV__;

AppRegistry.registerComponent('App', () => App);
AppRegistry.runApplication('App', {
  rootTag: document.getElementById('saas-plat')
});
