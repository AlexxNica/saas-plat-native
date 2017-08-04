import {
  observable,
  computed,
  runInAction,
  action
} from 'mobx';
import { registerStore } from '../core/Store';
import * as apis from '../apis/ServerApis';
import {
  DataModel
} from '../models/DataModel';

@registerStore('dataStore')
export default class DataStore {
  @observable datas = [];

}
