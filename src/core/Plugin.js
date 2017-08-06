import PubSub from 'pubsub-js';
import {tx} from '../utils/internal';

export default class Plugin {
  module;
  tokens = [];

  constructor(module) {
    this.module = module;
  }

  subscribe(msg, handler) {
    if (arguments.length === 1) {
      this.tokens.push(PubSub.subscribe(this.module, handler));
    }
    this.tokens.push(PubSub.subscribe(this.module + '.' + msg, handler));
  }

  unsubscribe() {
    this.tokens.forEach(token => {
      PubSub.unsubscribe(token);
    });
    this.tokens.length = 0;
  }

  static publish(msg, data) {
    console.log(tx('发布事件'), msg);
    PubSub.publish(msg, data);
  }

  static publishSync(msg, data){
    console.log(tx('发布同步事件'), msg);
    PubSub.publish(msg, data);
  }
}
