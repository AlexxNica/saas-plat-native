import React from 'react';
import {
   StyleSheet,
   View,
   ScrollView,
   Platform
} from 'react-native';
import {Actions} from 'saasplat-native';
import FloatLabelTextInput  from 'react-native-floating-label-text-input';

export default class extends React.Component{
  constructor(props){
    super(props);
    this.state={
      name: props.baseInfo? props.baseInfo.name : '',
      shortName: props.baseInfo? props.baseInfo.shortName : '',
      industry: props.baseInfo? props.baseInfo.industry : '',
      address: props.baseInfo? props.baseInfo.address : '',
      postcode: props.baseInfo? props.baseInfo.postcode : '',
      legalRepresentative: props.baseInfo? props.baseInfo.legalRepresentative : '',
      note: props.baseInfo? props.baseInfo.note : ''
    };
  }

 onSave(gotoAction){
     this.props.saveBaseInfo(this.state);
     if (gotoAction) gotoAction();
 }

 componentWillMount(){
   Actions.refresh({
     onRight: this.onSave.bind(this, this.props.onRight)
   });
 }

  render() {
    return (
      <ScrollView contentContainerStyle={this.props.style} style={styles.container}>
        <View style={{height:300}}>
          <FloatLabelTextInput
            style={styles.inputItem}
            placeholder={"单位名称"}
            value={this.state.name}
          />
          <FloatLabelTextInput
            style={styles.inputItem}
            placeholder={"单位简称"}
            value={this.state.shortName}
          />
          <FloatLabelTextInput
            style={styles.inputItem}
            placeholder={"所属行业"}
            value={this.state.industry}
          />
          <FloatLabelTextInput
            style={styles.inputItem}
            placeholder={"单位地址"}
            value={this.state.address}
          />
          <FloatLabelTextInput
            style={styles.inputItem}
            placeholder={"邮政编码"}
            value={this.state.postcode}
          />
          <FloatLabelTextInput
            style={styles.inputItem}
            placeholder={"法人代表"}
            value={this.state.legalRepresentative}
          />
        </View>
        <FloatLabelTextInput
          style={styles.inputItem}
          placeholder={"备注"}
          value={this.state.note}
        />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    marginTop: Platform.OS === 'ios' || Platform.Version > 19 ? 64 : 44,
    backgroundColor: '#fff'
  },
  inputItem:{
    height: 20
  }
});
