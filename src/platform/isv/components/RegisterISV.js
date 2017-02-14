import React from 'react';
import {
  View,
  Text,
  StyleSheet
} from 'react-native';
import {
  Actions
} from 'react-native-router-flux';
import assert from 'assert';

export default class extends React.Component{
  constructor(props) {
      super(props);
      this.state = {
        disabled: false
      };
  }

  render(){
    return (
      <View style={styles.container}>

      </View>
    );
  }
}

const styles =  StyleSheet.create({
	container: {
		flex: 1,
		// justifyContent: 'center',
		// alignItems: 'center',
		backgroundColor: '#fff',
		paddingTop: 264,
	},
	btn: {
		fontSize: 20,
		color: '#000',
		height: 45,
		overflow: 'hidden',
		borderRadius: 4,
		backgroundColor: '#ccc'
	},
	btnContainer: {
		padding: 3,
	},
});
