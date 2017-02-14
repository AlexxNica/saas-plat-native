import React from 'react';
import {Registry, Scene} from 'saasplat-native';
import Login from '../components/Login';
import GetForgetPassword from '../components/GetForgetPassword';
import GesturePassword from '../components/GesturePassword';
import Register from '../components/Register';

Registry.registerRootRoute(() => (
  <Scene key='index'>
    <Scene key='login' title='登录' hideNavBar component={Login}>
      <Scene key='password' passwordMode/>
      <Scene key='quick' quickMode/>
    </Scene>
    <Scene key='gesturePassword' component={GesturePassword} direction='vertical' title='解锁'/>
    <Scene key='register' component={Register} hideNavBar={false} title='注册' type='push'/>
    <Scene
      key='getForgetPassword'
      component={GetForgetPassword}
      hideNavBar={false}
      title='重置密码'
      type='push'/>
  </Scene>
));
