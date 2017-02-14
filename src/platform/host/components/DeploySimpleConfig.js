import React from 'react';
import {
   StyleSheet,
   Text,
   View,
   ScrollView,
   Picker,
   Platform
} from 'react-native';

const Independent = 'Independent';
const Shared = 'Shared';

export default class extends React.Component{
  constructor(props){
    super(props);
    this.state={
      server: props.webaserver || Shared
    }
  }

  getValue(){
    return this.state;
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>选择主机配置，所有主机均有阿里云服务提供</Text>
        <Text style={[styles.text,styles.p]}>共享主机：免费使用，但是不适合企业正式应用，适合试用可以切换到独立主机</Text>
        <Text style={[styles.text,styles.p]}>共享主机：按照使用量或按年收费，费用根据配置计算，适合企业正式应用</Text>
        <Picker
         selectedValue={this.state.webaserver}
         onValueChange={(servertype) => this.setState({webaserver: servertype})}>
         <Picker.Item label="共享主机(免费试用)" value={Shared} />
         <Picker.Item label="独立主机" value={Independent} />
        </Picker>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    marginTop: Platform.OS === 'ios' || Platform.Version > 19 ? 64 : 44,
    backgroundColor: '#fff'
  },
  text:{
    margin: 20
  },
  p:{
    marginTop: 10
  }
});
