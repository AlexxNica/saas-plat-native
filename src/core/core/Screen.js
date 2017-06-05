import { Dimensions } from 'react-native';
const { width } = Dimensions.get('window');

const ScreenTypes = [
  [
    'xxs', 312
  ], // 手表
  [
    'xs', 768
  ], // 手机
  ['sm': 992], // PAD
  [
    'md', 1200
  ], // PC MAC
  [
    'lg', 999999
  ], // TV LED
];

const Size = ScreenTypes.find(item => width < item[1])[0];

// 获取合适尺寸
const get = (...types) => {
  const supportTypes = ScreenTypes.filter(t => types.indexOf(t[0]) > -1);
  if (supportTypes.length <= 0) {
    return '';
  }
  const type = supportTypes.find(t => width < t[1]);
  if (type) {
    return type[0];
  }
  return '';
};

export default {
  ScreenTypes,
  Size,
  get
};
