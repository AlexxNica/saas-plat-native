import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableHighlight
} from 'react-native';
import {autobind} from 'core-decorators';
import {debuggingEmitter, debuggingList, startDebug, stopDebug} from '../core/Debug';
import {translate} from '../core/I18n';
import {connectStyle} from '../core/Theme';

const isDebuggingIgnored = function() {
  return false;
};

const DebuggingRow = ({debugging, style}) => {
  return (
    <View style={style.inspectorRow}>
      <TouchableHighlight activeOpacity={0.5} style={style.inspectorRowContent} underlayColor='transparent'>
        <Text style={style.inspectorRowText}>
          {debugging}
        </Text>
      </TouchableHighlight>
    </View>
  );
};

const DebuggingInspector = ({debuggingList, onClose, onDismissAll, style}) => {
  const rows = [];
  debuggingList.forEach((debugging) => {
    if (!isDebuggingIgnored(debugging)) {
      rows.push(<DebuggingRow key={debugging} debugging={debugging} style={style}/>);
    }
  });

  const countSentence = `调试信息 ${rows.length} 条.`;

  return (
    <TouchableHighlight activeOpacity={0.95} underlayColor={style.backgroundColor(0.8)} style={style.inspector}>
      <View style={style.inspectorContent}>
        <View style={style.inspectorCount}>
          <Text style={style.inspectorCountText}>{countSentence}</Text>
        </View>
        <ScrollView style={style.inspectorList} contentContainerStyle={style.inspectorListContainer}>
          {rows}
        </ScrollView>
        <View style={style.inspectorButtons}>
          <TouchableHighlight activeOpacity={0.5} onPress={onClose} style={style.inspectorButton} underlayColor='transparent'>
            <Text style={style.inspectorButtonText}>
              关闭
            </Text>
          </TouchableHighlight>
          <TouchableHighlight activeOpacity={0.5} onPress={onDismissAll} style={style.inspectorButton} underlayColor='transparent'>
            <Text style={style.inspectorButtonText}>
              清空所有
            </Text>
          </TouchableHighlight>
        </View>
      </View>
    </TouchableHighlight>
  );
};

class DebugView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      debuggingList,
      inspecting: false
    };
  }

  componentDidMount() {
    let scheduled = null;
    this._listener = debuggingEmitter.addListener('debug', debuggingList => {
      // Use `setImmediate` because debuggings often happen during render, but
      // state cannot be set while rendering.
      scheduled = scheduled || setImmediate(() => {
        scheduled = null;
        this.setState({debuggingList});
      });
    });
    if (!!(devOptions && devOptions.debugMode)) {
      startDebug();
    }
  }

  componentWillUnmount() {
    stopDebug();
    if (this._listener) {
      this._listener.remove();
    }
  }

  @autobind
  dismissDebugging() {
    const {inspecting, debuggingList} = this.state;
    debuggingList.length = 0;
    this.setState({inspecting: false, debuggingList});
  }

  @autobind
  disableInspecting() {
    this.setState({inspecting: false});
  }

  @autobind
  enableInspecting() {
    this.setState({inspecting: true});
  }

  render() {
    if (!(devOptions.debugMode) || this.state.debuggingList.length === 0) {
      return null;
    }

    const view = this.state.inspecting
      ? <DebuggingInspector debuggingList={this.state.debuggingList} onClose={this.disableInspecting} onDismissAll={this.dismissDebugging} style={this.props.style}/>
      : <View style={this.props.style.tipRow}>
        <TouchableHighlight activeOpacity={0.5} onPress={this.enableInspecting} style={this.props.style.tipRowContent} underlayColor='transparent'>
          <View>
            <Text style={this.props.style.tipRowText} numberOfLines={2}>
              {this.state.debuggingList[this.state.debuggingList.length - 1]}
            </Text>
          </View>
        </TouchableHighlight>
      </View>;

    return (
      <View style={this.state.inspecting
        ? this.props.style.fullScreen
        : this.props.style.tip}>
        {view}
      </View>
    );
  }
}

export default translate(['core.DebugView'])(connectStyle('core.DebugView')(DebugView));
