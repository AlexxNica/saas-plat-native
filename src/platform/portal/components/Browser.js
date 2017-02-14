import React from 'react';
import {WebView} from 'react-native';

export default class extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      url: props.url,
      status: '未加载',
      backButtonEnabled: false,
      closeButtonEnabled: false,
      loading: true
    };
  }

  goBack() {
   this.refs.webview.goBack();
  }

 componentWillReceiveProps(nextProps){
   this.setState({
     url: nextProps.url,
     status: '未加载',
     backButtonEnabled: false,
     closeButtonEnabled: false,
     loading: true
   });
  }

  onNavigationStateChange(){

  }

  onShouldStartLoadWithRequest(){
    return true;
  }

  render(){
    if (!this.state.url){
      return (<View>
          <Text>没有找到任何页面</Text>
        </View>);
    }
    // "normal"和"fast"
    return (<WebView
          ref='webview'
          automaticallyAdjustContentInsets={false}
          style={{flex:1}}
          source={{uri: this.state.url}}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          decelerationRate="fast"
          onNavigationStateChange={this.onNavigationStateChange}
          onShouldStartLoadWithRequest={this.onShouldStartLoadWithRequest}
          startInLoadingState={true}
          scalesPageToFit={false}
        />);
  }
}
