import {Dimensions} from 'react-native';
const {width} = Dimensions.get('window');

const lg = 1200;
const md = 992;
const sm = 768;
const xs = 312; 
const xxs = 0;

const ScreenTypes = [
  [
    'lg', lg
  ], // TV LED
  [
    'md', md
  ], // PC MAC
  [
    'sm', sm
  ], // PAD
  [
    'xs', xs
  ], // 手机
   [
    'xxs', xxs
  ], // 手表
];

const Size = ScreenTypes.find(item => width > item[1])[0];

// 获取合适尺寸
const get = (...types) => {
  const supportTypes = ScreenTypes.filter(t => types.indexOf(t[0]) > -1);
  if (supportTypes.length <= 0) {
    return '';
  }
  const type = supportTypes.find(t => width > t[1]);
  if (type) {
    return type;
  }
  return '';
};

export default {
  lg ,
  md,
  sm ,
  xs ,
  xxs,
  ScreenTypes,
  Size,
  width,
  get
};
