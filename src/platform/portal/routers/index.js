import { Registry, Screen } from 'saasplat-native';

let size;
const optsize = Screen.get('md', 'xs');
if (optsize === 'xs') {
  size = 'components'; // 手机版
} else {
  size = 'components_md'; // PC 版
}

Registry.registerRootRoute(() => [{
  path: '/',
  exact: true,
  component: require(`../${size}/Console`).default
}, {
  path: '/:id',
  component: require(`../${size}/Workspace`).default
}]);
