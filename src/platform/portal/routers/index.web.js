import { Registry } from 'saasplat-native';

import Workspace from '../webcomponents/Workspace';
import Console from '../webcomponents/Console';

Registry.registerRootRoute(({ t }) => [
  { path: '/', component: Console },
  { path: '/:id', component: Workspace }
]);
