import React from 'react';
import { AppRegistry } from 'react-native'
import App from './app';
import './spdefine';
import './bundles';

global.__DEV__ = __DEV__;

const el = document.getElementById('sp-loading');
el.parentNode.removeChild(el);

AppRegistry.registerComponent('App', () => App);
AppRegistry.runApplication('App', {
  rootTag: document.getElementById('saas-plat')
});
