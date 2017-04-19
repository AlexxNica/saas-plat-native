import React from 'react';
import {Registry, Route} from 'saasplat-native';

import ServerRegister from '../webcomponents/ServerRegister';
import ServerList from '../webcomponents/ServerList';
import ModuleList from '../webcomponents/ModuleList';
import NoServer from '../webcomponents/NoServer';
import NoModule from '../webcomponents/NoModule';
import Console from '../webcomponents/Console';

import {tr} from '../utils';

Registry.registerRootRoute(() => <Route path='index'>
  <Route path='home' hideNavBar component={ServerList}/>
  <Route
    path='notFoundServer'
    component={NoServer}
    backTitle={tr('CreateServer')}/>
  <Route path='createServer' component={ServerRegister} />
  <Route
    path='portal'
    routeRegisterUniquepath='portal'
    enablePortalController>
    <Route path='notFoundModule' component={NoModule}/>
    <Route path='moduleList' component={ModuleList}/>
  </Route>
  <Route path='user' >
    <Route path='console' hideNavBar component={Console}/>
  </Route>
</Route>);
