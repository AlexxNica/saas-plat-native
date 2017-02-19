import React from 'react';
import {autobind} from 'core-decorators';
import {
  ScrollView,
  View,
  TouchableOpacity,
  Text,
  Image,
  Dimensions
} from 'react-native';
import {connectStore, connectStyle, translate, Actions} from 'saasplat-native';
import {Col, Row, Grid} from 'react-native-easy-grid';
import Icon from 'react-native-vector-icons/SimpleLineIcons';

const {width} = Dimensions.get('window');
const colCount = Math.ceil(width / 125);

@translate('ModuleListLocales')
@connectStyle('ModuleListTheme')
@connectStore('serverStore')
@autobind
export default class ModuleList extends React.Component {

  renderCell(module) {
    let icon = {
      uri: 'http://facebook.github.io/react/img/logo_og.png'
    };
    const ns = module.name.split('/');
    return (
      <TouchableOpacity
        style={[
        this.props.style.cell, {
          width: width / colCount,
          height: width / colCount
        }
      ]}
        onPress={() => module.open()}>
        <View >
          <Image style={this.props.style.icon} source={icon}/>
          <Text style={this.props.style.text}>
            {ns[ns.length - 1]}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  componentDidMount() {
    Actions.refresh({
      hideNavBar: false,
      navigationBarStyle: this.props.style.navigationBar,
      renderRightButton: () => (<Icon.Button
        name='user'
        backgroundColor={this.props.style.base.navigationBar.backgroundColor}
        color={this.props.style.base.button.color}
        onPress={() => Actions.gotoAction('user')}/>),
      renderBackButton: () => (<Icon.Button
        name='arrow-left'
        backgroundColor={this.props.style.base.navigationBar.backgroundColor}
        color={this.props.style.base.button.color}
        onPress={() => Actions.pop()}/>)
    });
  }

  render() {
    const modules = this.props.serverStore.modules;
    const rowCount = Math.ceil(modules.length / colCount);
    const rows = [];
    for (let i = 0; i < rowCount; i++) {
      const cols = [];
      for (let k = 0; k < colCount; k++) {
        if ((i * colCount) + k < modules.length) {
          const module = modules[(i * colCount) + k];
          cols.push(
            <Col key={k}>
              {this.renderCell(module)}
            </Col>
          );
        } else {
          cols.push(<Col key={k}/>);
        }
      }
      rows.push(
        <Row key={i}>
          {cols}
        </Row>
      );
    }
    return (
      <ScrollView style={this.props.style.container}>
        <Grid style={this.props.style.grid}>
          {rows}
        </Grid>
      </ScrollView>
    );
  }
}
