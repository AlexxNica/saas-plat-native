import React from 'react';
import {
  ScrollView,
  Text,
  StyleSheet,
	TouchableOpacity,
  Platform
} from 'react-native';
import {
  Actions
} from 'saasplat-native';

export default class extends React.Component{
  constructor(props) {
      super(props);
      this.state = {
        disabled: false
      };
  }

  render(){
    return (
      <ScrollView style={{flex:1}} contentContainerStyle={styles.container}>
        <Text>加入企业</Text>
      </ScrollView>
    );
  }
}

const styles =  StyleSheet.create({
  container:{
    flex: 1,
    marginTop: Platform.OS === 'ios' || Platform.Version > 19 ? 64 : 44,
    backgroundColor: '#fff'
  },
});
