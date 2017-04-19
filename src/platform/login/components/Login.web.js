import React from 'react';
import {
  View,
  Text,
} from 'react-native';

let styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
};

export default class GetForgetPassword extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View style={styles.container}>
        <Text >
          web login
        </Text>
      </View>
    );
  }
}
