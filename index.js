import 'react';
import { AppRegistry } from 'react-native';
import App from './src/App';
global.__MOCK__ = __MOCK__;
AppRegistry.registerComponent('App', () => App);
