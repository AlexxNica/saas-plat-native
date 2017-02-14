import React from 'react';
import {
  StyleSheet,
   Text,
   View,
   ScrollView,
   Platform
} from 'react-native';
import {Actions} from 'saasplat-native';
import ScrollableTabView, {
  ScrollableTabBar
} from 'react-native-scrollable-tab-view';
import BaseInfo from './BaseInfo';
import HostConfig from './HostConfig';
import AppInstaller from './AppInstaller';

export default class extends React.Component{
  constructor(props) {
      super(props);
  }

  componentWillMount(){
    Actions.refresh({
      rightTitle:"确定",
      onRight: this.createHandler.bind(this)
    });
  }

  createHandler(){
    let dto = {
      info:this.refs.baseInfo.getValue(),
      host:this.refs.baseInfo.getValue(),
      apps:this.refs.baseInfo.getValue()
    };

    Actions.gotoAction('waitting', {type:'push', dto});
  }

  render(){
    return (<View style={styles.container}>
     <ScrollableTabView initialPage={0} renderTabBar={() => <ScrollableTabBar />}>
       <BaseInfo ref='baseInfo' tabLabel='基本信息' style={styles.tabCard}/>
       <HostConfig ref='hostConfig' tabLabel='主机配置' style={styles.tabCard}  />
       <AppInstaller ref='appInstaller' tabLabel='安装应用' style={styles.tabCard} />
     </ScrollableTabView>
   </View>);
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Platform.OS === 'ios' || Platform.Version > 19 ? 64 : 44,
    backgroundColor: '#fff'
  },
  tabCard:{
    flex: 1
  }
});
