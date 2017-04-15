import {Platform} from 'react-native';

if (Platform.OS === 'android' || Platform.OS === 'ios') {
  // 捕获除render和组件生命周期中异常
  ErrorUtils.setGlobalHandler(function(err) {
    console.error(err);
  });
}
