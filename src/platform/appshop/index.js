import { Registry, Scene } from 'saasplat-native';

import ShopIndex from './components/ShopIndex';

Registry.registerRootRoute(()=>(
	<Scene key='openShop'>
    <Scene key='shopIndex' component={ShopIndex} title='安装应用' />
	</Scene>
));
