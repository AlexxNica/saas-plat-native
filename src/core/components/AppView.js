import React from 'react';
import { Platform } from 'react-native';

import PlatformLoading from './PlatformLoading';
import ModuleLoading from './ModuleLoading';
import MessageView from './MessageView';
import AppIntro from './AppIntro';

import { Router, Route,  Switch } from '../core/Router';
import { connectStyle } from '../core/Theme';
import { tx } from '../utils/internal';

@connectStyle
export default class AppView extends React.Component {
  render() {
    switch (Platform.OS) {
      case 'android':
      case 'ios':
        return (
          <Router style={this.props.style}>
            <Route key='root' hideNavBar routeRegisterUniqueKey='root'>
              <Route key='loadPlatform' type='replace' initial component={PlatformLoading} hideNavBar/>
              <Route key='showAppIntro' type='reset' component={AppIntro} hideNavBar/>
              <Route key='loadModule' type='push' component={ModuleLoading}/>
            </Route>
            <Route key='failed' component={MessageView}/>
        </Router>
        );
      case 'web':
        return (
          <Router>
            <Switch>
               <Route path="/" component={PlatformLoading} />
               <Route path="/showAppIntro" component={AppIntro} />
               <Route key='/loadModule' component={ModuleLoading}/>
               <Route component={MessageView}/>
             </Switch>
           </Router>
        );
      case 'windows':
      case 'macos':
      default:
        console.error(tx('平台路由尚未支持', Platform.OS));
        return null;
    }
  }
}
