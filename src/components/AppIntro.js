import React, {Component} from 'react';
import {Text, View, Image, StatusBar} from 'react-native';
import assert from 'assert';
import AppIntro from 'react-native-app-intro';
import {autobind} from 'core-decorators';
import {connectStore} from '../core/Store';
import { connectStyle } from '../core/Theme';

@connectStore(['systemStore'])
@connectStyle('core.AppIntro')
@autobind
export default class AppIntroView extends Component {
  handleDone() {
    this.props.systemStore.setSystemOption({appVersion: this.props.systemStore.config.version});
    assert(this.props.onDone); // onDone必须有值
    this.props.history.replace('/login');
  }

  render() {
    // onDone 在action中设置的，在PlatformLoading.js中
    return (
      <AppIntro onDoneBtnClick={this.handleDone} onSkipBtnClick={this.handleDone}>
        <View
          style={[
          this.props.style.slide, {
            backgroundColor: '#fa931d'
          }
        ]}>
          <StatusBar barStyle="light-content"/>
          <View style={this.props.style.header}>
            <View>
              <Image
                style={{
                width: 75 * 2.5,
                height: 63 * 2.5
              }}
                source={require('../assets/1/c1.png')}/>
            </View>
            <View
              style={{
              position: 'absolute',
              top: 80,
              left: -20
            }}
              level={20}>
              <Image
                style={{
                width: 46 * 2.5,
                height: 28 * 2.5
              }}
                source={require('../assets/1/c2.png')}/>
            </View>
            <View
              style={{
              position: 'absolute',
              top: 23,
              left: -25
            }}
              level={20}>
              <Image
                style={{
                width: 109 * 2.5,
                height: 68 * 2.5
              }}
                source={require('../assets/1/c5.png')}/>
            </View>
            <View
              style={{
              position: 'absolute',
              top: 65,
              left: -15
            }}
              level={5}>
              <Image
                style={{
                width: 23 * 2.5,
                height: 17 * 2.5
              }}
                source={require('../assets/1/c3.png')}/>
            </View>
          </View>
          <View style={this.props.style.info}>
            <View level={10}>
              <Text style={this.props.style.title}>管理云平台</Text>
            </View>
            <View level={15}>
              <Text style={this.props.style.description}>财务报表、生意往来随时掌控。</Text>
            </View>
          </View>
        </View>
        <View
          style={[
          this.props.style.slide, {
            backgroundColor: '#a4b602'
          }
        ]}>
          <StatusBar barStyle="light-content"/>
          <View style={this.props.style.header}>
            <View>
              <Image
                style={{
                width: 75 * 2.5,
                height: 63 * 2.5
              }}
                source={require('../assets/2/1.png')}/>
            </View>
            <View
              style={{
              position: 'absolute',
              top: 30,
              left: -10
            }}
              level={20}>
              <Image
                style={{
                width: 101 * 2.5,
                height: 71 * 2.5
              }}
                source={require('../assets/2/2.png')}/>
            </View>
            <View
              style={{
              position: 'absolute',
              top: 10,
              left: 0
            }}
              level={-20}>
              <Image
                style={{
                width: 85 * 2.5,
                height: 73 * 2.5
              }}
                source={require('../assets/2/3.png')}/>
            </View>
          </View>
          <View style={this.props.style.info}>
            <View level={10}>
              <Text style={this.props.style.title}>Title!</Text>
            </View>
            <View level={15}>
              <Text style={this.props.style.description}>description!</Text>
            </View>
          </View>
        </View>
        <View
          style={[
          this.props.style.slide, {
            backgroundColor: '#406E9F'
          }
        ]}>
          <StatusBar barStyle="light-content"/>
          <View style={this.props.style.header}>
            <View
              style={{
              position: 'absolute',
              top: 20,
              left: -30
            }}>
              <Image
                style={{
                width: 138 * 2.5,
                height: 83 * 2.5
              }}
                source={require('../assets/3/3.png')}/>
            </View>
            <View
              style={{
              position: 'absolute',
              top: 25,
              left: -10
            }}
              level={-15}>
              <Image
                style={{
                width: 103 * 2.5,
                height: 42 * 2.5
              }}
                source={require('../assets/3/4.png')}/>
            </View>
            <View level={10}>
              <Image
                style={{
                width: 95 * 2.5,
                height: 55 * 2.5
              }}
                source={require('../assets/3/1.png')}/>
            </View>
            <View
              style={{
              position: 'absolute',
              top: 65,
              left: 70
            }}
              level={25}>
              <Image
                style={{
                width: 47 * 2.5,
                height: 43 * 2.5
              }}
                source={require('../assets/3/2.png')}/>
            </View>
          </View>
          <View style={this.props.style.info}>
            <View level={10}>
              <Text style={this.props.style.title}>Title!</Text>
            </View>
            <View level={15}>
              <Text style={this.props.style.description}>description!</Text>
            </View>
          </View>
        </View>
        <View
          style={[
          this.props.style.slide, {
            backgroundColor: '#DB4302'
          }
        ]}>
          <StatusBar barStyle="light-content"/>
          <View style={this.props.style.header}>
            <View
              style={{
              position: 'absolute',
              top: 25,
              left: -35
            }}
              level={15}>
              <Image
                style={{
                width: 96 * 2.5,
                height: 69 * 2.5
              }}
                source={require('../assets/4/4.png')}/>
            </View>
            <View>
              <Image
                style={{
                width: 50 * 2.5,
                height: 63 * 2.5
              }}
                source={require('../assets/4/1.png')}/>
            </View>
            <View
              style={{
              position: 'absolute',
              top: 20,
              left: 0
            }}
              level={20}>
              <Image
                style={{
                width: 46 * 2.5,
                height: 98 * 2.5
              }}
                source={require('../assets/4/3.png')}/>
            </View>
          </View>
          <View style={this.props.style.info}>
            <View level={10}>
              <Text style={this.props.style.title}>Title!</Text>
            </View>
            <View level={15}>
              <Text style={this.props.style.description}>description!</Text>
            </View>
          </View>
        </View>
      </AppIntro>
    );
  }
}
