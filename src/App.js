import React from 'react';
import { Platform, BackAndroid } from 'react-native';
import { StyleProvider } from '@shoutem/theme';
import { I18nextProvider } from 'react-i18next';
import './core/Error'; // 导入全局异常处理
import i18n from './core/I18n';
import Router from './core/Router';
import * as Push from './core/Push';

import Theme from './stores/Theme';
import I18nStore from './stores/I18n';

import ViewPort from './components/ViewPort';

import {observer} from './utils/helper';

i18n.init({
  fallbackLng: ['default'],
  ns: ['common'],
  defaultNS: 'common',
  cache: {
    enabled: true
  },
  backend: {
    store: I18nStore.getStore()
  }
}).changeLanguage();

// 主体化、路由，调试器
@observer
export default class App extends React.Component {
  constructor(){
    super();
  }

  componentDidMount() {
    if (Platform.OS === 'android') {
      BackAndroid.addEventListener('hardwareBackPress', () => {
        console.log('go back');
        try {
          Router.goBack();
          return false;
        } catch (err) {
          console.warn(err);
        }
      });
    }

    if (Platform.OS === 'android' || Platform.OS === 'ios') {
      // 开启push
      Push.subscribe();
    }
  }

  componentWillUnmount() {
    if (Platform.OS === 'android' || Platform.OS === 'ios') {
      Push.unsubscribe();
    }

    if (Platform.OS === 'android') {
      BackAndroid.removeEventListener('hardwareBackPress');
    }
  }

  render() {
    return (
      <I18nextProvider i18n={i18n}>
        <StyleProvider style={Theme.getStore().currentTheme}>
          <ViewPort>
            {this.props.children}
          </ViewPort>
        </StyleProvider>
      </I18nextProvider>
    );
  }
}
