import React from 'react';
import { Platform } from 'react-native';
import { autobind } from 'core-decorators';
import nprogress from 'nprogress';
import Bundle from '../core/Bundle';
import { connectStore } from '../core/Store';
import Router from '../core/Router';
import { Route, Switch, observer } from '../utils/helper';

import PlatformLoading from './PlatformLoading';
import ModuleLoading from './ModuleLoading';
import MessageView from './MessageView';
import AppIntro from './AppIntro';

@connectStore(['routerStore', 'userStore'])
@observer
export default class AppRouter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    props.history.block(this.loadModule);
    props.history.listen(this.loadView);
  }

  @autobind
  loadView(location, action) {
    // debugger;
    if (Platform.OS === 'web') {
      nprogress.done();
    }
  }

  @autobind
  loadModule(location, action) {
    debugger;
    const name = Router.getBundle(location.pathname);
    if (!name || Bundle.hasLoad(name)) {
      return true;
    }
    const bundleConfig = Bundle.getBundle(name);
    if (!bundleConfig) {
      return true;
    }
    // 验证权限
    if (!this.checkAuth(this.props)) {
      return false;
    }
    if (Platform.OS === 'web') {
      nprogress.start();
    } else {
      this.setState({
        bundleConfig,
        moduleLoading: true
      });
    }
    return false;
  }

  @autobind
  handlePlanformLoaded() {
    this.setState({
      platformSuccess: true
    });
    this.checkAuth(this.props);
  }

  @autobind
  handleModuleLoaded(bundleConfig) {
    if (this.state.bundleConfig === bundleConfig) {
      if (Platform.OS === 'web') {
        nprogress.done();
      } else {
        this.setState({
          moduleLoading: false
        });
      }
    }
  }

  @autobind
  checkAuth({ location }) {
    if (location.pathname != '/login' && location.pathname != '/sso') {
      if (!this.props.userStore.user) {
        this.props.history.push('/login');
        return false;
      }
    }
    // 平台公共页面不验证
    return true;
  }

  componentWillReceiveProps(nextProps) {
    debugger
    if (this.state.platformSuccess) {
      this.checkAuth(nextProps);
    }
  }

  render() {
    const { history, location } = this.props;
    const props = { history, location };
    if (this.state.moduleLoading) {
      return <ModuleLoading {...props} onComplated={this.handleModuleLoaded} bundleConfig={this.state.bundleConfig}/>;
    } else if (this.state.platformSuccess) {
      return (
        <Switch>
          <Route path='/appintro' component={AppIntro}/>
          {(this.props.routerStore.getRoutes('/')).map((item) => <Route {...item} key={item.path.replace(/\//g, '_')}/>)}
          <Route component={MessageView} code={404}/>
        </Switch>
      );
    } else {
      // 所有路由都必须先进行平台加载后才能进入
      return <PlatformLoading {...props} onComplated={this.handlePlanformLoaded}/>;
    }
  }
}
