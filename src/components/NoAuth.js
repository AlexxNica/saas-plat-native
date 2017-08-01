import React from 'react';
import { Text, View } from 'react-native';
import { Link } from '../utils/helper';
import { connectStyle } from '../core/Theme';
import { translate } from '../core/I18n';

export default translate('core.NoAuth')(connectStyle('core.NoAuth')((props) => {
  return (
    <View style={props.style.container}>
      <Text style={props.style.text}>{props.t('没有权限，无法访问~')}</Text>
      <Link to='/login?change=true'>{props.t('切换账号')}</Link>
    </View>
  );
}));
