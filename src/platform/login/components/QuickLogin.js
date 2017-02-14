import React from 'react';
import {
  View,
  StatusBar,
  Text,
  Alert,
  Image,
  TouchableOpacity,
  Platform
} from 'react-native';
import TouchID from 'react-native-touch-id';
import PasscodeAuth from 'react-native-passcode-auth';
import {autobind} from 'core-decorators';
import {login} from '../utils/login';
import {connectStore, connectStyle, translate, Actions} from 'saasplat-native';

@translate('platform.login.QuickLogin')
@connectStyle('platform.login.QuickLogin')
@connectStore('userStore')
@autobind
export default class QuickLogin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      msgText: '点击进行指纹解锁'
    };
  }

  handleLoginPress() {
    this.props.userStore.relogin().then(() => {
      login();
    }).catch(err => {
      debugger
      Alert.alert('登录', (err && err.message) || '最近登录账户恢复登录失败', [
        {
          text: '其他账户登录',
          onPress: () => this.handleOtherPress()
        }, {
          text: '取消'
        }
      ]);
    });
  }

  handleOtherPress() {
    Actions.gotoAction('password', {type: 'refresh'});
  }

  showTouchID() {
    const me = this;
    TouchID.authenticate('通过Home键验证已有指纹').then((success) => {
      if (success) {
        console.log('User authenticated with Touch ID');
        me.handleLoginPress.bind(me)();
      }
    }).catch((error) => {
      if (error.name === 'LAErrorUserFallback' || error.name === 'LAErrorPasscodeNotSet' || error.name === 'LAErrorTouchIDNotAvailable' || error.name === 'LAErrorTouchIDNotEnrolle' || error.name === 'RCTTouchIDNotSupported') {
        me.checkPasscode.bind(me)();
        return;
      }
      if (error.name === 'LAErrorUserCancel' || error.name === 'LAErrorSystemCancel') {
        return;
      }
      console.log('Authentication Failed');
    });
  }

  showPasscode() {
    PasscodeAuth.authenticate('请输入解锁密码').then((success) => {
      if (success) {
        console.log('User authenticated with Passcode');
        this.handleLoginPress();
      }
    }).catch((error) => {
      // Failure code
      console.log(error);
    });
  }

  checkPasscode() {
    const me = this;
    if (Platform.OS === 'ios') {
      if (this.passcodeAuthhasCheck) {
        if (this.passcodeAuthSupported) {
          me.showPasscode();
        }
      } else {
        PasscodeAuth.isSupported().then((supported) => {
          console.log('Passcode Auth is supported.');
          this.passcodeAuthhasCheck = true;
          this.passcodeAuthSupported = supported;
          me.showPasscode();
        }).catch((error) => {
          if (error.name === 'LAErrorUserCancel' || error.name === 'LAErrorUserFallback' || error.name === 'LAErrorSystemCancel' || error.name === 'LAErrorPasscodeNotSet' || error.name === 'PasscodeAuthNotSupported') {
            return;
          }
          console.log(error);
        });
      }
    } else {
      this.setState({msgText: '当前设备不支持指密码解锁'});
    }
  }

  showGesturePassword() {
    Actions.gotoAction('getForgetPassword', {
      success: () => {
        console.log('User authenticated with Gesture');
        this.handleLoginPress();
      },
      error: () => {}
    });
  }

  checkTouchID() {
    const me = this;
    TouchID.isSupported().then((supported) => {
      me.touchIDhasCheck = true;
      me.touchIDSupported = supported;
      if (supported) {
        console.log('TouchID is supported.');
        me.showTouchID();
      } else {
        me.checkPasscode();
      }
    }).catch((error) => {
      // Failure code
      console.log(error);

      me.checkPasscode();
    });
  }

  showQuick() {
    if (Platform.OS === 'ios') {
      if (this.touchIDhasCheck) {
        if (this.touchIDSupported) {
          this.showTouchID();
        } else {
          this.checkPasscode();
        }
      } else {
        this.checkTouchID();
      }
    } else {
      this.showGesturePassword();
    }
  }

  componentDidMount() {
    if (__DEV__) {
      // 开发时不需要验证权限
      this.handleLoginPress();
    } else {
      // 访问本机数据，需要解锁权限
      setTimeout(this.showQuick, 500); // settimeout 防止弹出框影响页面加载动画
    }
  }

  render() {
    const s = this.props.userStore.loginState;
    const styles = this.props.style;
    return (
      <View style={styles.flexContainer}>
        <StatusBar hidden={false}/>
        <View style={styles.cellHeader}>
          <View style={styles.iconBg}>
            <Image style={styles.userIcon} source={(s && s.user && s.user.headIconUrl)
              ? {
                uri: s.user.headIconUrl
              }
              : require('../assets/user-icon.png')}/>
          </View>
        </View>
        <View style={styles.cell}>
          <TouchableOpacity onPress={this.showQuick}>
            <View style={styles.cellView}>
              <Image style={styles.figIcon} source={require('../assets/quick-fingerprint.png')}/>
              <Text style={[styles.text, styles.figText, styles.base.button.link]}>
                {this.state.msgText}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={this.handleOtherPress}>
          <View style={styles.cellBottom}>
            <Text style={[styles.text, styles.base.button.link]}>
              登录其他账户
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}
