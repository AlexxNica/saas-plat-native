import PubSub from 'pubsub-js';

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
}
