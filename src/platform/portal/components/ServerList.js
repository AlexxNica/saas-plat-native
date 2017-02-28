import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  TouchableHighlight,
  Platform
} from 'react-native';
import {autobind} from 'core-decorators';
import GiftedListView from 'react-native-gifted-listview';
import {connectStore, connectStyle, translate} from 'saasplat-native';
import {observer} from 'mobx-react/native';

@translate('ServerListLocales')
@connectStyle('ServerListTheme')
@connectStore({appStore: 'ServerListStore'})
@observer
@autobind
export default class ServerList extends React.Component {

  componentDidMount() {
    this.props.appStore.prepare();
  }

  onPressFeed() {
    if (this.props.appStore.loading) {
      return;
    }
    this.porps.appStore.prepare();
  }

  onPress(rowData) {
    this.props.appStore.changeServer({id: rowData});
  }

  onFetch(page = 1, callback, options) {
    setTimeout(() => {
      var rows = [
        ['server ' + ((page - 1) * 3 + 1)],
        ['server ' + ((page - 1) * 3 + 2)],
        ['server ' + ((page - 1) * 3 + 3)]
      ];
      if (page === 3) {
        callback(rows, {
          allLoaded: true, // the end of the list is reached
        });
      } else {
        callback(rows);
      }
    }, 1000); // simulating network fetching
  }

  renderSpinner() {
      return (<ActivityIndicator animating style={this.props.style.indicator} size='small'/>);
  }

  renderLoading() {
    return (
      <View style={this.props.style.container}>
        {this.renderSpinner()}
        <TouchableOpacity onPress={this.onPressFeed}>
          <View>
            <Text style={this.props.style.success}>
              {this.props.appStore.message || this.props.t('Loading')}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  renderRowView(rowData) {
    const styles = this.props.style;
    return (
      <TouchableHighlight
        style={styles.row}
        underlayColor='#c8c7cc'
        onPress={() => this.onPress(rowData)}>
        <View>
          <Text>{rowData}</Text>
        </View>
      </TouchableHighlight>
    );
  }

  renderServerList() {
    const styles = this.props.style;
    return (
      <View style={styles.container}>
        <View style={styles.navBar}/>
        <GiftedListView paginationFetchingView={this.renderSpinner} rowView={this.renderRowView} onFetch={this.onFetch} firstLoader // display a loader for the first fetching
          pagination // enable infinite scrolling using touch to load more
          refreshable // enable pull-to-refresh for iOS and touch-to-refresh for Android
          withSections // enable sections
          customStyles={styles.listView} refreshableTintColor={styles.refreshableTintColor}/>
      </View>
    );
  }

  render() {
    return this.props.appStore.loading
      ? this.renderLoading()
      : this.renderServerList();
  }
}
