import React from 'react';

import PlatformLoading from './PlatformLoading';
import ModuleLoading from './ModuleLoading';
import MessageView from './MessageView';
import AppIntro from './AppIntro';

import {Router, Scene, Modal} from '../core/Router';
import {connectStyle} from '../core/Theme';

@connectStyle
export default class AppView extends React.Component {
  render() {
    return (
      <Router style={this.props.style}>
        <Scene key='modal' component={Modal} routeRegisterUniqueKey='modal'>
          <Scene key='root' hideNavBar routeRegisterUniqueKey='root'>
            <Scene key='loadPlatform' type='replace' initial component={PlatformLoading} hideNavBar/>
            <Scene key='showAppIntro' type='reset' component={AppIntro} hideNavBar/>
            <Scene key='loadModule' type='push' component={ModuleLoading}/>
          </Scene>
          <Scene key='failed' component={MessageView}/>
        </Scene>
      </Router>
    );
  }
}
