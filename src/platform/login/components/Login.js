import React from 'react';

import Password from './PasswordLogin';
import Quick from './QuickLogin';
import {connectStore} from 'saasplat-native';

export default connectStore('userStore')((props) => {
  let Component;
  if (props.passwordMode) {
    Component = Password;
  } else if (props.quickMode) {
    Component = Quick;
  } else {
    Component = props.userStore.loginState && props.userStore.loginState.token
      ? Quick
      : Password;
  }
  return <Component {...props}/>;
});
