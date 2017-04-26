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
import { autobind } from 'core-decorators';
import AwesomeButton from 'react-native-awesome-button';
import { connectStore, connectStyle, translate, Actions } from 'saasplat-native';

@translate('saas-plat-login.PasswordLogin')
@connectStyle('saas-plat-login.PasswordLogin')
@connectStore('userStore')
@autobind
export default class PasswordLogin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      disabled: false,
      loginState: 'idle',
      username: this.props.userStore.loginState.username,
      password: '',
      emptyUsernameInput: false,
      inputPlaceholder: props.t('输入手机号码/邮箱/会员名'),
      emptyPasswordInput: false,
      inputPasswordPlaceholder: props.t('输入登录密码'),
      loginText: props.t('登录')
    };
  }

  getForgetPassword() {
    Actions.gotoAction('getForgetPassword');
  }

  handleLogin() {
    if (this.state.disabled) {
      return;
    }
    if (!this.state.username) {
      this.setState({
        emptyUsernameInput: true,
        inputPlaceholder: this.props.t('用户名不能为空')
      });
      this.username.focus();
      return;
    }
    console.log(this.props.t('正在登录...'));
    this.setState({ disabled: true, loginState: 'busy' });
    this.props.userStore.login({
      username: this.state.username,
      password: this.state.password
    }).then(() => {
      this.setState({ loginState: 'success' });
      this.props.history.replace('/portal');
    }).catch((error) => {
      console.warn(error);
      this.showLoginMessage(error);
    });
  }

  showLoginMessage(msg) {
    Alert.alert(this.props.t('提示'), (msg && msg.toString()) || this.props.t(
      '错误，请重试~'), [{
      text: this.props.t('再次登录')
    }]);
    this.setState({
      disabled: false,
      loginState: 'idle',
      loginText: this.props.t('再次登录')
    });
  }

  register() {
    Actions.gotoAction('register');
  }

  handleChange(username) {
    this.setState({
      username,
      emptyUsernameInput: false,
      inputPlaceholder: this.props.t('输入手机号码/邮箱/会员名')
    });
  }

  handlePasswordChange(password) {
    this.setState({
      password,
      emptyPasswordInput: false,
      inputPasswordPlaceholder: this.props.t('输入登录密码')
    });
  }

  endEdit() {
    if (this.state.username === '') {
      this.username.focus();
      return;
    }
    if (this.state.password === '') {
      this.password.focus();
      return;
    }
    this.handleLogin();
  }

  showUsernameList() {}

  render() {
    const styles = this.props.style;
    return (
      <ScrollView
        keyboardShouldPersistTaps='always'
        keyboardDismissMode='on-drag'
        style={styles.scrollContainer}
        contentContainerStyle={[styles.container]}>
        <StatusBar barStyle='default'/>
        <View style={styles.header}>
          <Image
            style={{
            width: 100,
            height: 100
          }}
            source={require('../assets/logo.png')}/>
          <Text style={[styles.headerText]}>{this.props.t('SaasPlat')}</Text>
          <Text
            style={{
            fontSize: 12,
            color: styles.colors.grey0
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
              ref={ref => this.username = ref}
              style={[styles.input]}
              keyboardType='email-address'
              autoFocus={true}
              underlineColorAndroid='rgba(0,0,0,0)'
              placeholder={this.state.inputPlaceholder}
              value={this.state.username}
              onSubmitEditing={this.endEdit}
              onChangeText={this.handleChange}
              autoCorrect={false}
              autoCapitalize='none'
              placeholderTextColor={this.state.emptyUsernameInput
              ? styles.colors.error
              : styles.colors.grey3}/>
            <TouchableOpacity onPress={this.showUsernameList}>
              <Image
                style={styles.inputSelectUsername}
                source={require('../assets/user-dropdown.png')}/>
            </TouchableOpacity>
          </View>
          <View style={styles.userList}>
            {this.props.userStore.historyList.items.map(user => {
              <TouchableOpacity style={styles.userListItem}
                onPress={
                  this.showUsernameList
                }>
                <Image
                  style={styles.userIcon}
                  source={user.headIconUrl
                  ? { uri: user.headIconUrl }
                  : require('../assets/user-icon.png')}/>
                </TouchableOpacity>
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
              ref={ref => this.password = ref}
              style={[styles.input]}
              keyboardType='ascii-capable'
              secureTextEntry={true}
              underlineColorAndroid='rgba(0,0,0,0)'
              placeholder={this.state.inputPasswordPlaceholder}
              value={this.state.password}
              onChangeText={this.handlePasswordChange}
              onSubmitEditing={this.endEdit}
              autoCorrect={false}
              autoCapitalize='none'
              placeholderTextColor={this.state.emptyPasswordInput
              ? styles.colors.error
              : styles.colors.grey3}/>
          </View>

            <AwesomeButton
              transitionDuration={200}
              states={{
                idle: {
                  text: this.state.loginText,
                  backgroundStyle: styles.idle,
                  labelStyle: styles.labelStyle,
                  onPress: this.handleLogin
                },
                busy: {
                  text: this.props.t('正在登录...'),
                  spinner: true,
                  spinnerProps: {
                    animated: true,
                    color: 'white'
                  },
                  backgroundStyle: styles.busy
                },
                success: {
                  text: this.props.t('已登录'),
                  backgroundStyle: styles.success
                }
              }}
              buttonState={this.state.loginState }
            />
        </View>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.left} onPress={this.getForgetPassword}>
            <Text style={{color:styles.colors.primary2}}>{this.props.t('GetForgetPassword')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.right} onPress={this.register}>
            <Text style={{color:styles.colors.primary2}}>{this.props.t('CreateAccount')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }
}
