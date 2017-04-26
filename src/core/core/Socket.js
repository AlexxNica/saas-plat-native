import io from 'socket.io-client';
import assert from 'assert';
import config from '../config';
import {tx} from '../utils/internal';

const socket = io(config.platform.address);

const chatHandlers = [];

socket.on('connect', function() {
  console.log(tx('即时通信服务已连接'));
  socket.on('disconnect', function(msg) {
    console.log(tx('即时通信服务已关闭'));
  });
  socket.on('chat-message', function(msg) {
    chatHandlers.forEach(handler => handler(msg));
  });
});

export const chat = {
  // 给某个账户发送消息
  send(to, message) {
    socket.emit('chat', { message, to, datetime: new Date() });
  },

  receive(handler) {
    assert(typeof handler === 'function');
    chatHandlers.push(handler);
  },

  close(handler){
    assert(typeof handler === 'function');
    for(let i=0;i<chatHandlers.length;i++){
      if (chatHandlers[i] === handler){
        chatHandlers = chatHandlers.splice(i,1);
        break;
      }
    }
  }
};

export default socket;
