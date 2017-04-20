import { Registry } from 'saasplat-native';

import Login from '../components/Login';
import GetForgetPassword from '../components/GetForgetPassword';
import Register from '../components/Register';

Registry.registerRootRoute(({ t }) => [{
  path: '/',
  component: Login,
  title: t('登录')
}, {
  path: '/register',
  component: Register,
  title: t('注册')
}, {
  path: '/getForgetPassword',
  component: GetForgetPassword,
  title: t('重置密码')
}]);
