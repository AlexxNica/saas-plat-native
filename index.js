import 'react';
import { AppRegistry as AppLoader } from 'react-native';

export class AppRegistry {
  static registerComponent(appLoader) {
    AppLoader.registerComponent('Saasplat', appLoader);
  }
}
