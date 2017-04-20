import React from 'react';
import { Registry, Scene, Style, Actions } from 'saasplat-native';
import BaseInfo from './components/BaseInfo';
import DeploySimpleConfig from './components/DeploySimpleConfig';
import Creating from './components/Creating';
import Finished from './components/Finished';
import Join from './components/Join';
import InviteSend from './components/InviteSend';
import ScanJoin from './components/ScanJoin';
import HostTypeSelector from './components/HostTypeSelector';
import DeploymentSetting from './components/DeploymentSetting';
import AppInstallList from './components/AppInstallList';

import * as ActionCreator from './actions/HostActions';
import * as HostReducer from './reducers/HostReducer';

//import Icon from 'react-native-vector-icons/FontAwesome';

// Registry.registerRootRoute(()=>[
//   <Scene key='join'>
//      <Scene key='inputJoin' component={Join} title='加入企业'
//           onLeft={()=>{Actions.pop()}} leftTitle="返回"
//   	   onRight={()=>Actions.gotoAction('register',{type:'push'})} rightTitle="创建企业"/>
//      <Scene key='scanJoin' component={ScanJoin} hideNavBar={true}  direction='vertical'/>
//    </Scene>,
//
// 		<Scene key='register'>
//       <Scene key='baseInfo' component={BaseInfo} title='企业信息'
//         leftTitle='取消' onLeft={()=>{Actions.pop()}}
//         rightTitle='下一步' onRight={()=>Actions.gotoAction('configHost')} />
//       <Scene key='configHost' component={DeploySimpleConfig} title='云主机配置'
//         rightTitle='创建企业' onRight={()=>Actions.gotoAction('creating')}/>
//       <Scene key='creating' type='reset' component={Creating} title='正在配置'	hideNavBar={true}/>
//       <Scene key='finished' type='replace' component={Finished} title='成功'
//         leftTitle='进入系统' onLeft={()=>{Actions.gotoAction('platform/portal',{type:'reset'})}}
//         rightTitle='邀请用户' onRight={()=>{Actions.gotoAction('sendInvitation' )}} />
//     </Scene>,
//
//     <Scene key='sendInvitation' component={InviteSend} title='邀请用户'
//         onLeft={()=>{Actions.pop()}} leftTitle="返回"/>,
//
//     <Scene key='manage'>
//   		<Scene key='applist' component={AppInstallList} title='应用管理'
//         leftTitle='返回' onLeft={()=>{Actions.pop()}}
//   			onRight={()=>Actions.gotoAction('platform/appshop',{type:'push',
//   				linkAction:{text:'管理', name:'manageHost'}})} rightTitle="添加" />
//   		<Scene key='deploy' component={DeploymentSetting} title='主机配置'  />
//     </Scene>
// ]);
//
// Registry.registerAction(()=>ActionCreator);
// Registry.registerReducer(()=>HostReducer);
