import React from 'react';
import queryString  from 'query-string';
import { Registry, userStore } from 'saasplat-native';
import Login from '../components/Login';

const url = __DEV__ ?
  'http://localhost:8200/usr' :
  'http://usr.saas-plat.com'

Registry.registerRootRoute(() => [{
  path: '/login',
  auth: false,
  render: ({ history, location }) => {
    if (userStore.loginState){
      // 恢复登陆状态
      return <Login history={history} location={location}/>;
    }
    let redirect, changeAccountTxt = '';
    if (__DEV__) {
      redirect = 'http://localhost:8200/sso'
    } else {
      redirect = 'http://app.saas-plat.com/sso'
    }
    if (queryString.parse(location.search).change) {
      changeAccountTxt = '&change=true';
    }
    window.location.href = `${url}/account/sso/login?redirect=${encodeURIComponent(redirect)}${changeAccountTxt}`;
    return null;
  }
}, {
  path: '/logout',
  auth: false,
  render: () => {
    window.location.href = url + '/account/sso/logout';
    return null;
  }
}, {
  path: '/register',
  auth: false,
  render: () => {
    window.location.href = url + '/account/register';
    return null;
  }
}, {
  path: '/getForgetPassword',
  auth: false,
  render: () => {
    window.location.href = url + '/account/forgotpassword';
    return null;
  }
}, {
  path: '/sso',
  auth: false,
  component: Login
}]);
