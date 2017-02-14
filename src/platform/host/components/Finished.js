import React from 'react';
import {
	View, 　　　　
	Text, 　　
	StatusBar,
	Platform,
	NetInfo,
  ScrollView,
  StyleSheet,
	TouchableOpacity
}
from 'react-native';
import {Actions} from 'saasplat-native';

export default class extends React.Component {
  render() {
    return (
      <ScrollView style={styles.view} contentContainerStyle={styles.container} >
         <StatusBar hidden={false}  />

         <View style={[styles.p,{flex:1}]}>
         <Text style={styles.text}>
           恭喜~~你已经成功创建了企业移动私有云服务，现在可以安装业务系统并邀请企业成员进入办公啦~~
         </Text>
        <TouchableOpacity onPress={()=>{Actions.gotoAction('platform/appshop',{type:'push'})}}>
          <View>
            <Text style={[styles.button, this.props.theme.link]}>
              安装办公系统
            </Text>
          </View>
        </TouchableOpacity>
        </View>

      <View style={[styles.p,{flex:1}]}>
        <Text style={styles.text}>
          任何问题你还可以点这里联系平台的资深业务专家们，他们都是从事着相关行业的工作人员或系统开发者
        </Text>
        <TouchableOpacity onPress={()=>{Actions.gotoAction('platform/job/pre-sales',{type:'push'})}}>
          <View>
            <Text style={[styles.button, this.props.theme.link]}>
              我要咨询
            </Text>
          </View>
        </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  view:{
    flex:1,
    backgroundColor:'#fff'
  },
  container:{
    flex:1,
    backgroundColor: '#fff'
  },
  text:{

  },
  p:{
    justifyContent: 'center',
    alignItems: 'center',
  },
  button:{
    padding: 6,
    fontSize: 18
  }
});
