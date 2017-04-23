import React from 'react';
import {Platform} from 'react-native';
import PlatformLoading from './PlatformLoading';
import ModuleLoading from './ModuleLoading';
import MessageView from './MessageView';
import AppIntro from './AppIntro';

import {connectStore} from '../core/Store';
import {tx} from '../utils/internal';

const observer = Platform.OS === 'web'
  ? require('mobx-react').observer
  : require('mobx-react/native').observer;

let Router,
  Route,
  Switch;
switch (Platform.OS) {
  case 'android':
  case 'ios':
  case 'windows':
  case 'macos':
    {
      const NativeRouter = require('react-router-native');
      Router = NativeRouter.NativeRouter;
      Route = NativeRouter.Route;
      Switch = NativeRouter.Switch;
      break;
    }
  case 'web':
    {
      const BrowserRouter = require('react-router-dom');
      Router = BrowserRouter.BrowserRouter;
      Route = BrowserRouter.Route;
      Switch = BrowserRouter.Switch;
      break;
    }
  default:
    console.error(tx('不支持的路由平台'), Platform.OS);
    break;
}

export default connectStore(['routerStore'])(observer((props) => {
  if (!Router) {
    return null;
  }
  return (
    <Router>
      <Switch>
        <Route exact path='/' component={PlatformLoading}/>
        <Route path='/appintro' component={AppIntro}/>
        <Route path='/404' component={MessageView} code={404}/>
        {(props.routerStore.routes['/'] || []).map(item => <Route {...item}/>)}
        <Route component={ModuleLoading}/>
      </Switch>
    </Router>
  );
}));
