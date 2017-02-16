import {
  Actions,
  User
} from 'saasplat-native';

export function login(userData) {
   // 登陆完打开门户
  setTimeout(function(){
    try {
      Actions.gotoAction('saas-plat-portal', {
        type: 'reset'
      });
    } catch (err) {
      debugger;
      console.log('go to portal failed.');
      console.warn(err);
      // Actions.gotoAction('failed',{
      //   type: 'reset'
      // });
    }
  }, 0);

  return true;
}
