import React from 'react';
import queryString  from 'query-string';
import { View, Text, ActivityIndicator } from 'react-native';
import { connectStore, translate, connectStyle } from 'saasplat-native';

@translate('core.Login')
@connectStyle('core.Login')
@connectStore('userStore')
export default class Login extends React.Component {
  constructor() {
    super();
    this.state = {};
  }
  componentDidMount() {
    this.props.userStore.login(queryString.parse(location.search).token).then(() => {
      this.props.history.replace('/portal');
    }).catch((error) => {
      console.warn(error);
      this.setState({
        animating: false,
        message: error
      })
    });
  }
  render() {
    return (
      <View style={this.props.style.container}>
        <ActivityIndicator
          animating={this.state.animating !== false}
          style={this.props.style.indicator} size='small' />
        <Text style={this.props.style.success}>
          {this.state.message || this.props.t('正在登录，请稍后...')}
        </Text>
      </View>
    );
  }
}
