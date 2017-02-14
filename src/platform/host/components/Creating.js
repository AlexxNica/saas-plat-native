import React from 'react';
import {
	View, 　　　　
	Text, 　　
	StatusBar,
	Platform,
	NetInfo,
  StyleSheet,
	TouchableOpacity
}
from 'react-native';
import {Actions,User} from 'saasplat-native';
import Spinner from './Spinner';

export default class extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      finished: false,
      message: '正在创建你的私有云服务...'
    };
  }

  create(){
    this.props.createServer(this.props.baseInfo, this.props.hostConfig);
  }

  componentWillReceiveProps(nextProps){
    if (!nextProps.result){
      return;
    }
    if (!nextProps.result.success){
      this.setState({
        finished: true,
        message: nextProps.result.message || '创建企业服务失败.'
      });
      return;
    }

    this.setState({
        finished: true,
        message: '申请成功'
    });

    setTimeout(()=>{
      Actions.gotoAction('finished');
    }, 1000);
  }

  componentDidMount(){
    setTimeout(this.create.bind(this),1000);
  }

  render() {
    return (
      <View style={styles.container}>
        <Spinner visible={!this.state.finished}  />
        <Text style={styles.message}>
          {this.state.message }
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  message:{
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 120,
    color: '#111',
  }
});
