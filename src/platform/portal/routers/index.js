import React from 'react';
import {Registry, Scene, themeStore} from 'saasplat-native';

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

import Console from '../components/Console';

import {tr} from '../utils';

Registry.registerRootRoute(() => <Scene key='index'>
  <Scene key='home' hideNavBar component={ServerList}/>
  <Scene
    key='notFoundServer'
    component={NoServer}
    backTitle={tr('CreateServer')}/>
  <Scene key='createServer' hideNavBar={false}>
    <Scene key='introduce' component={Introduce}/>
    <Scene key='baseInfo' component={BaseInfo} backTitle={tr('Introduce')}/>
    <Scene key='hostSelector' component={HostSelector} backTitle={tr('BaseInfo')}/>
    <Scene key='submit' component={ServerSubmit} backTitle={tr('HostSelector')}/>
    <Scene key='pay' component={Pay} backTitle={tr('ServerSubmit')}/>
    <Scene key='complate' component={CreateSuccess} title={tr('CreateSuccess')}/>
  </Scene>
  <Scene
    key='portal'
    hideNavBar
    routeRegisterUniqueKey='portal'
    enablePortalController>
    <Scene key='notFoundModule' component={NoModule}/>
    <Scene key='moduleList' component={ModuleList}/>
  </Scene>
  <Scene key='user' hideNavBar={false}>
    <Scene key='console' hideNavBar component={Console}/>
  </Scene>
  <Scene key='openWeb' hideNavBar={false} component={Browser}/>
</Scene>);
