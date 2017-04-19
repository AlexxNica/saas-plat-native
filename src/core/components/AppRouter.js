import React from 'react';
import { Platform } from 'react-native';

import PlatformLoading from './PlatformLoading';
import ModuleLoading from './ModuleLoading';
import MessageView from './MessageView';
import AppIntro from './AppIntro';

import { Router, Route, Switch } from '../core/Router';

export default () => {
  return (
    <Router>
    <Switch>
      <Route path="/" component={PlatformLoading} />
      <Route path="/showAppIntro" component={AppIntro} />
      <Route path='/loadModule' component={ModuleLoading}/>
      <Route component={MessageView}/>
    </Switch>
  </Router>
  );
}
