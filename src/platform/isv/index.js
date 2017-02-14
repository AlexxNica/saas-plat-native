import React from 'react';
import { Registry, Scene, Style } from 'saasplat-native';
import RegisterISV from './components/RegisterISV';

Registry.registerRootRoute(()=>(
	<Scene key='isv'  >
		<Scene key='registerISV' component={Style.connectTheme(RegisterISV)} title='申请服务商ISV' />
	</Scene>
));
