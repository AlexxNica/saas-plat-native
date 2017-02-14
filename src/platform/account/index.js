import {
  Scene,
  Registry
} from 'saasplat-native';

Registry.registerRoute(()=>(
  <Scene key='me' component={Me} icon={TabIcon} title='我' />
));
