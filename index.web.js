import 'react';
import { AppRegistry as AppLoader } from 'react-native';

global.__DEV__ = __DEV__;

export class AppRegistry {
  static registerComponent(appLoader) {
    AppLoader.registerComponent('App', appLoader);
    AppLoader.runApplication('App', {
      rootTag: document.getElementById('saas-plat')
    });
  }
}
