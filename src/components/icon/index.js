import React from 'react';
import {Platform} from 'react-native';
import SimpleLineIcon from 'react-native-vector-icons/SimpleLineIcons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import styleicon from './style';

function registerTTF(lib, name) {
  // generate required css
  const fontAwesome = require('react-native-vector-icons/Fonts/' + lib);
  const reactNativeVectorIconsRequiredStyles = '@font-face { src:url(' + fontAwesome + ');font-family: ' + name + '; }'

  // create stylesheet
  const style = document.createElement('style');
  style.type = 'text/css';
  if (style.styleSheet) {
    style.styleSheet.cssText = reactNativeVectorIconsRequiredStyles;
  } else {
    style.appendChild(document.createTextNode(reactNativeVectorIconsRequiredStyles));
  }

  // inject stylesheet
  document.head.appendChild(style);
}

if (Platform.OS === 'web') {
  registerTTF('SimpleLineIcons.ttf', 'simple-line-icons');
  registerTTF('FontAwesome.ttf', 'FontAwesome');
}

export default({
  style = {},
  type = 'simpleline',
  ...other
}) => {
  let Icon;
  switch (type.toLocaleLowerCase()) {
    case 'fontawesome':
      Icon = FontAwesomeIcon;
      break;
    case 'simpleline':
    default:
      Icon = SimpleLineIcon;
      break
  }
  return (<Icon style={[
    styleicon.icon, ...style
  ]} {...other}/>);
};
