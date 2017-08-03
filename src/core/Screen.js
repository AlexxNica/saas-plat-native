import { Dimensions } from 'react-native';
const { width, scale } = Dimensions.get('window');

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
  // web采用了高清方案，这里需要折算回大小判断
  const w = width / scale;
  const type = supportTypes.find(t => w > t[1]);
  if (type) {
    return type;
  }
  return '';
};

export default {
  lg,
  md,
  sm,
  xs,
  xxs,
  ScreenTypes,
  Size,
  width,
  get
};
