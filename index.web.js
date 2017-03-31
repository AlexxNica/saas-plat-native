 import {AppRegistry} from 'react-native';
import App from './app';
import './spdefine';
import './bundles';
AppRegistry.registerComponent('Saasplat', () => App);
AppRegistry.runApplication('Saasplat', {
  rootTag: document.getElementById('saas-plat')
});
