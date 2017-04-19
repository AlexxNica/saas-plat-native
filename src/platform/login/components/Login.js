import React from 'react';
import { View } from 'react-native';

import Password from './PasswordLogin';
import Quick from './QuickLogin';
import { connectStore, Route, Redirect } from 'saasplat-native';

export default connectStore('userStore')(({ match, userStore }) => {
  return (
    <View>
      {match.isExact && userStore.loginState && userStore.loginState.token?
      <Redirect to={{
         pathname: `${match.url}/quick`
       }}/>:null}
      <Route path={`${match.url}/password`} component={Password}/>
      <Route path={`${match.url}/quick`} component={Quick}/>
    </View>
  );
});
