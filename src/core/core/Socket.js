import io from 'socket.io-client';
import assert from 'assert';
import config from '../config';
import { tx } from '../utils/internal';

// 平台消息，例如接口扫码、支付通知等状态更新
export default class Message {
  receivers = new Map();
  socket;

  constructor() {
    this.socket = io.connect(config.platform.address);
    this.socket.on('connect', (msg) => {
      console.log(msg || tx('平台即时服务已连接'));
      this.socket.on('disconnect', (msg) => {
        console.log(msg || tx('平台即时服务已关闭'));
      });
      this.socket.on('message', function(msg) {
        this.receivers.forEach(handler => handler(msg));
      });
    });
  }

  send(command, message) {
    if (command) {
      this.socket.emit(command, message);
    } else {
      this.socket.send(message);
    }
  }

  receive(command, handler) {
    assert(typeof handler === 'function');
    if (this.receivers.has(command)) {
      this.receivers[command].push(handler);
    } else {
      this.receivers[command] = [handler];
    }
  }

  close(command, handler) {
    assert(typeof handler === 'function');
    let handlers = this.receivers[command];
    if (!handlers || handlers.length <= 0) {
      return;
    }
    for (let i = 0; i < handlers.length; i++) {
      if (handlers[i] === handler) {
        this.receivers[command] = handlers.splice(i, 1);
        break;
      }
    }
  }
}

// 即时通讯服务
export class Chat {
  receivers = [];
  socket;

  constructor() {
    this.socket = io.connect(config.platform.chat);
    this.socket.on('connect', (msg) => {
      console.log(msg || tx('即时通信服务已连接'));
      this.socket.on('disconnect', (msg) => {
        console.log(msg || tx('即时通信服务已关闭'));
      });
      this.socket.on('message', function(msg) {
        this.receivers.forEach(handler => handler(msg));
      });
    });
  }

  // 给某个账户发送消息
  send(from, to, message) {
    this.socket.emit('chat', { from, to, message, datetime: new Date() });
  }

  receive(handler) {
    assert(typeof handler === 'function');
    this.receivers.push(handler);
  }

  close(handler) {
    assert(typeof handler === 'function');
    for (let i = 0; i < this.receivers.length; i++) {
      if (this.receivers[i] === handler) {
        this.receivers = this.receivers.splice(i, 1);
        break;
      }
    }
  }
}
