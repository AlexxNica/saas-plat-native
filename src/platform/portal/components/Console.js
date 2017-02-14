import React from 'react';
import {Text, View, Image, Dimensions} from 'react-native';
import ParallaxView from 'react-native-parallax-view';
import {Col, Row, Grid} from "react-native-easy-grid";
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import Avatar from 'react-native-interactive-avatar';
import {autobind} from 'core-decorators';
import {connectStore, connectStyle, translate, Actions} from 'saasplat-native';
import {observer} from 'mobx-react/native';

@translate('ConsoleLocales')
@connectStyle('ConsoleTheme')
@connectStore({appStore: 'ConsoleStore'})
@observer
@autobind
export default class Console extends React.Component {

  constructor() {
    super();
    this.state = {};
  }

  componentDidMount() {
    Actions.refresh({
      hideNavBar: false,
      navigationBarStyle: this.props.style.navigationBar,
      renderBackButton: () => (<Icon.Button
        name='arrow-left'
        backgroundColor={this.props.style.button.link.backgroundColor}
        iconStyle={this.props.style.button.link}
        onPress={() => Actions.pop()}/>)
    });
  }

  handleGridPress(module) {
    alert(module.text);
  }

  renderModuleItem(module) {
    let icon = {
      uri: 'http://facebook.github.io/react/img/logo_og.png'
    };
    return (
      <View style={this.props.style.moduleItem}>
        <Image style={this.props.style.icon} source={icon}/>
        <Text style={this.props.style.text}>
          {module.text || 'xxxx'}
        </Text>
      </View>
    );
  }

  renderModuleGrid() {
    const {width} = Dimensions.get('window');
    const colCount = Math.ceil(width / 125);
    const modules = this.props.appStore.modules;
    const rowCount = Math.ceil(modules.length / colCount);
    const rows = [];
    for (let i = 0; i < rowCount; i++) {
      const cols = [];
      for (let k = 0; k < colCount; k++) {
        if (((i * colCount) + k) < modules.length) {
          const module = modules[(i * colCount) + k];
          cols.push(
            <Col key={(i * colCount) + k}>
              {this.renderModuleItem(module)}
            </Col>
          );
        } else {
          cols.push(
            <Col key={(i * colCount) + k}></Col>
          );
        }
      }
      rows.push(
        <Row key={i}>
          {cols}
        </Row>
      );
    }
    return (
      <Grid style={[this.props.grid]}>
        {rows}
      </Grid>
    );
  }

  handleImageChange(backgroundSource) {
    this.setState({backgroundSource});
  }

  renderHeader() {
    return (
      <View style={this.props.style.avatar}>
        <Avatar
          uri={'https://media2.giphy.com/media/sbLpwwHlgls8E/giphy.gif'}
          size={'default'}
          placeholderURI={require('../assets/avatar-default.png').uri}
          interactive
          onChange={this.handleImageChange}/>
      </View>
    );
  }

  render() {
    return (
      <ParallaxView
        backgroundSource={this.state.backgroundSource || require('../assets/avatar-default.png')}
        windowHeight={200}
        blur='light'
        blurAmount={10}
        header={this.renderHeader()}
        scrollableViewStyle={this.props.style.scrollable}>
        {this.renderModuleGrid()}

      </ParallaxView>
    );
  }

}
