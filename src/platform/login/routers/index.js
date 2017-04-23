import { Registry } from 'saasplat-native';

import Login from '../components/Login';
import GetForgetPassword from '../components/GetForgetPassword';
import Register from '../components/Register';

import {tr} from '../utils';

Registry.registerRootRoute(() => [{
  path: '/login',
  component: Login,
  title: tr('登录')
}, {
  path: '/register',
  component: Register,
  title: tr('注册')
}, {
  path: '/getForgetPassword',
  component: GetForgetPassword,
  title: tr('重置密码')
}]);
