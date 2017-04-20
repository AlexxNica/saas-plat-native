import React from 'react';
import {Registry, Route} from 'saasplat-native';

import Browser from '../components/Browser';
import NoModule from '../components/NoModule';
import ModuleList from '../components/ModuleList';
import ServerList from '../components/ServerList';
import NoServer from '../components/NoServer';
import Introduce from '../components/Introduce';
import BaseInfo from '../components/BaseInfo';
import HostSelector from '../components/HostSelector';
import ServerSubmit from '../components/ServerSubmit';
import Pay from '../components/Pay';
import CreateSuccess from '../components/Completed';


import {tr} from '../utils';

Registry.registerRootRoute(() => <Route path='index'>
  <Route path='home' hideNavBar component={ServerList}/>
  <Route
    path='notFoundServer'
    component={NoServer}
    backTitle={tr('CreateServer')}/>
  <Route path='createServer' hideNavBar={false}>
    <Route path='introduce' component={Introduce}/>
    <Route path='baseInfo' component={BaseInfo} backTitle={tr('Introduce')}/>
    <Route path='hostSelector' component={HostSelector} backTitle={tr('BaseInfo')}/>
    <Route path='submit' component={ServerSubmit} backTitle={tr('HostSelector')}/>
    <Route path='pay' component={Pay} backTitle={tr('ServerSubmit')}/>
    <Route path='complate' component={CreateSuccess} title={tr('CreateSuccess')}/>
  </Route>
  <Route
    path='portal'
    hideNavBar
    routeRegisterUniquepath='portal'
    enablePortalController>
    <Route path='notFoundModule' component={NoModule}/>
    <Route path='moduleList' component={ModuleList}/>
  </Route>
  <Route path='user' hideNavBar={false}>
    <Route path='console' hideNavBar component={Console}/>
  </Route>
  <Route path='openWeb' hideNavBar={false} component={Browser}/>
</Route>);
