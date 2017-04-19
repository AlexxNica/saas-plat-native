import React from 'react';
import {Registry, Route} from 'saasplat-native';
import Login from '../components/Login';
import GetForgetPassword from '../components/GetForgetPassword';
import Register from '../components/Register';

Registry.registerRootRoute(() => (
  <Route path='index'>
    <Route path='login' title='登录' hideNavBar component={Login}>
      <Route path='password' passwordMode/>
      <Route path='quick' quickMode/>
    </Route>
    <Route path='register' component={Register} hideNavBar={false} title='注册' type='push'/>
    <Route
      path='getForgetPassword'
      component={GetForgetPassword}
      hideNavBar={false}
      title='重置密码'
      type='push'/>
  </Route>
));
