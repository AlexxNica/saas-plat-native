import React from 'react';
import { StyleProvider } from '@shoutem/theme';
import { I18nextProvider } from 'react-i18next';
import { BackAndroid } from 'react-native';
import { observer } from 'mobx-react/native';
import './core/Error'; // 导入全局异常处理
import i18n from './core/I18n';
import * as Push from './core/Push';
import { Actions } from './core/Router';

import Theme from './stores/Theme';
import I18nStore from './stores/I18n';

import ViewPort from './components/ViewPort';

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
  componentDidMount() {
    BackAndroid.addEventListener('hardwareBackPress', () => {
      console.log('go back');
      try {
        Actions.pop();
        return false;
      } catch (err) {
        console.warn(err);
      }
    });

    // 开启push
    Push.subscribe();
  }

  componentWillUnmount() {
    Push.unsubscribe();
    BackAndroid.removeEventListener('hardwareBackPress');
  }

  render() {
    return (
      <I18nextProvider i18n={i18n}>
        <StyleProvider style={Theme.getStore().currentTheme}>
          <ViewPort/>
        </StyleProvider>
      </I18nextProvider>
    );
  }
}
