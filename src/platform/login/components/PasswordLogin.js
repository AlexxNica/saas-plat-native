import React from 'react';
import {
  View,
  ScrollView,
  StatusBar,
  Image,
  Text,
  Alert,
  TextInput,
  TouchableOpacity
} from 'react-native';
import {autobind} from 'core-decorators';
import AwesomeButton from 'react-native-awesome-button';
import {connectStore, connectStyle, translate, Actions} from 'saasplat-native';
import {login} from '../utils/login';

@translate('saas-plat-login.PasswordLogin')
@connectStyle('saas-plat-login.PasswordLogin')
@connectStore('userStore')
@autobind
export default class PasswordLogin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      disabled: false,
      username: this.props.userStore.loginState.username,
      password: '',
      emptyUsernameInput: false,
      inputPlaceholder: '输入手机号码/邮箱/会员名',
      emptyPasswordInput: false,
      inputPasswordPlaceholder: '输入登录密码',
      loginText: '登录'
    };

  }

  showLoginMessage(msg) {
    Alert.alert('提示', (msg && msg.toString()) || '错误，请重试~', [
      {
        text: '重新登录'
      }
    ]);
    this.setState({disabled: false, loginText: '再次登录'});
  }

  handleLogin() {
    if (this.state.disabled) {
      return;
    }
    if (!this.state.username) {
      this.setState({emptyUsernameInput: true, inputPlaceholder: '用户名不能为空'});
      this.refs.username.focus();
      return;
    }
    console.log('login request...');
    this.setState({disabled: true, loginText: '正在登录...'});
    this.props.userStore.login({username: this.state.username, password: this.state.password}).then(() => {
      login();
    }).catch((error) => {
      console.warn(error);
      this.showLoginMessage(error);
    });
  }

  register() {
    Actions.gotoAction('register');
  }

  handleChange(username) {
    this.setState({username, emptyUsernameInput: false, inputPlaceholder: '输入手机号码/邮箱/会员名'});
  }

  handlePasswordChange(password) {
    this.setState({password, emptyPasswordInput: false, inputPasswordPlaceholder: '输入登录密码'});
  }

  endEdit() {
    if (this.state.username === '') {
      this.refs.username.focus();
      return;
    }
    if (this.state.password === '') {
      this.refs.password.focus();
      return;
    }
    this.handleLogin();
  }

  showUsernameList() {}

  getForgetPassword() {
    Actions.gotoAction('getForgetPassword');
  }

  render() {
    debugger
    let styles = this.props.style;
    return (
      <ScrollView
        keyboardShouldPersistTaps='always'
        keyboardDismissMode='on-drag'
        style={{
        flex: 1
      }}
        contentContainerStyle={[styles.container]}>
        <StatusBar barStyle='default'/>
        <View style={styles.header}>
          <Image
            style={{
            width: 100,
            height: 100
          }}
            source={require('../assets/logo.png')}/>
          <Text style={[styles.headerText]}>Saas-Plat</Text>
          <Text
            style={{
            fontSize: 12,
            color: styles.colors.secondary
          }}>saas-plat.com</Text>
        </View>

        <View style={styles.loginFormContainer}>
          <View
            style={[
            styles.inputContainer, this.state.emptyUsernameInput && {
              borderColor: styles.colors.error
            }
          ]}>
            <Image style={styles.inputUsername} source={require('../assets/user-alt.png')}/>
            <TextInput
              ref='username'
              style={[styles.input]}
              keyboardType='email-address'
              autoFocus={true}
              underlineColorAndroid='rgba(0,0,0,0)'
              placeholder={this.state.inputPlaceholder}
              value={this.state.username}
              onSubmitEditing={this.endEdit}
              onChangeText={this.handleChange}
              autoCorrect={false}
              autoCapitalize="none"
              placeholderTextColor={this.state.emptyUsernameInput
              ? styles.colors.error
              : styles.colors.grey0}/>
            <TouchableOpacity onPress={this.showUsernameList}>
              <Image
                style={styles.inputSelectUsername}
                source={require('../assets/user-dropdown.png')}/>
            </TouchableOpacity>
          </View>
          <View style={styles.userList}>
            {this.props.userStore.historyList.items.map(user => { < TouchableOpacity style = {
                styles.userListItem
              }
              onPress = {
                this.showUsernameList
              } > <Image
                style={styles.userIcon}
                source={user.headIconUrl
                ? {
                  uri: user.headIconUrl
                }
                : require('../assets/user-icon.png')}/> < /TouchableOpacity>
								})}
          </View>
          <View
            style={[
            styles.inputContainer, this.state.emptyPasswordInput && {
              borderColor: styles.colors.error
            }
          ]}>
            <Image
              style={styles.inputPassword}
              source={require('../assets/user-password.png')}/>
            <TextInput
              ref='password'
              style={[styles.input]}
              keyboardType='ascii-capable'
              secureTextEntry={true}
              underlineColorAndroid='rgba(0,0,0,0)'
              placeholder={this.state.inputPasswordPlaceholder}
              value={this.state.password}
              onChangeText={this.handlePasswordChange}
              onSubmitEditing={this.endEdit}
              autoCorrect={false}
              autoCapitalize="none"
              placeholderTextColor={this.state.emptyPasswordInput
              ? styles.colors.error
              : styles.colors.grey0}/>
          </View>
          <AwesomeButton
            backgroundStyle={{backgroundColor:styles.colors.primary1}}
            labelStyle={{color:styles.colors.primary}}
            transitionDuration={200}
            states={{
            idle: {
              text: this.state.loginText,
              backgroundColor: styles.colors.primary1,
              onPress: this.logIn
            },
            busy: {
              text: this.state.loginText,
              backgroundColor: styles.colors.primary2,
              spinner: true
            }
          }}
            buttonState={this.state.disabled
            ? 'busy'
            : 'idle'}/>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.left} onPress={this.getForgetPassword}>
            <Text style={{color:styles.colors.grey0}}>登录遇到问题?</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.right} onPress={this.register}>
            <Text style={{color:styles.colors.grey0}}>没有账户?</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }
}
