import React from 'react';
import {
  Button,
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TextInput,
  Alert,
  Platform
}
from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

let styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
};

export default class Register extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View style={styles.container}>
					<StatusBar 	hidden={false}  />
            	<Text style={styles.success}>快速注册</Text>
            </View>
    );
  }
}
