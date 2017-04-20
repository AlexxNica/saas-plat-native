import { Registry } from 'saasplat-native';

import ShopIndex from './components/ShopIndex';

Registry.registerRootRoute(() => [{ path: '/', component: ShopIndex }]);
