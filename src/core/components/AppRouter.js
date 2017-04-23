import React from 'react';
import {Platform} from 'react-native';
import PlatformLoading from './PlatformLoading';

import {tx} from '../utils/internal';

let Router,
  Route;
switch (Platform.OS) {
  case 'android':
  case 'ios':
  case 'windows':
  case 'macos':
    {
      const NativeRouter = require('react-router-native');
      Router = NativeRouter.NativeRouter;
      Route = NativeRouter.Route;
      break;
    }
  case 'web':
    {
      const BrowserRouter = require('react-router-dom');
      Router = BrowserRouter.BrowserRouter;
      Route = BrowserRouter.Route;
      break;
    }
  default:
    console.error(tx('不支持的路由平台'), Platform.OS);
    break;
}

export default () => {
  if (!Router) {
    return null;
  }
  return (
    <Router>
      <Route path='/' component={PlatformLoading}/>
    </Router>
  );
};
