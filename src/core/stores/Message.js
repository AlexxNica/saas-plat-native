import assert from 'assert';
import {observable, action} from 'mobx';
import MessageItemModel from '../models/Message';
import {registerStore} from '../core/Store';

@registerStore('messageStore')
export default class MessageStore {
  @observable messages = [];

  @action receiveMessage(...messages) {
    console.log('收到新消息');
    let now = new Date();
    messages.forEach(item => this.messages.push(MessageItemModel.fromJS({
      ...item,
      receiveDatetime: now
    })));
  }

  @action openMessage(...messages) {
    console.log('读取消息');
    let now = new Date();
    messages.forEach(item => item.readDatetime = now);
  }

  @action removeMesssage(...messages) {
    console.log('删除消息');
    messages.forEach(item => this.messages.splice(this.messages.indexOf(item), 1));
  }

  static getStore() {
    if (!this._instance) {
      this._instance = new MessageStore();
    }
    return this._instance;
  }
}
