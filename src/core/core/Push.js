import {
  NativeAppEventEmitter
} from 'react-native';
import MessageStore from '../stores/Message';

let store = MessageStore.getStore();
let subscriptions = [];

export function subscribe() {

  subscriptions.push(NativeAppEventEmitter.addListener(
    'ReceiveNotification',
    (notification) => {
      store.receiveMessage(notification);
      console.log(notification);
    }
  ));

  subscriptions.push(NativeAppEventEmitter.addListener(
    'OpenNotification',
    (notification) => {
      store.openMessage(notification);
      console.log(notification);
    }
  ));

  subscriptions.push(NativeAppEventEmitter.addListener(
    'networkDidReceiveMessage',
    (message) => {
      store.receiveMessage(message);
      console.log(message);
    }
  ));
}

export function unsubscribe() {
  // 千万不要忘记忘记取消订阅, 通常在componentWillUnmount函数中实现。
  subscriptions.forEach(subscriptions=>subscriptions.remove());
  subscriptions.length = 0;
}
