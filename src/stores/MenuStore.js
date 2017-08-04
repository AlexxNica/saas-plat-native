import { observable, action, runInAction, reaction } from 'mobx';
import assert from 'assert';
import { registerStore } from '../core/Store';
import Screen from '../core/Screen';

import localStore from '../utils/LocalStore';

import MenuModel from '../models/Menu';

import * as apis from '../apis/PlatformApis';

@registerStore('menuStore')
export default class MenuStore {
  @observable menus = [];
  @observable loaded = false;

  // 加载用户菜单
  @action async loadMenus(refresh = false) {}

}
