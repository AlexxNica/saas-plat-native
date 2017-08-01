import React from 'react';
import { Platform } from 'react-native';
import { autobind } from 'core-decorators';
import nprogress from 'nprogress';
import matchPath from 'react-router/matchPath';
import Bundle from '../core/Bundle';
import { connectStore } from '../core/Store';
import Router from '../core/Router';
import { Route, Switch, observer } from '../utils/helper';
import { tx } from '../utils/internal';

import PlatformLoading from './PlatformLoading';
import ModuleLoading from './ModuleLoading';
import MessageView from './MessageView';
import AppIntro from './AppIntro';
import { connectAuth } from './AuthedRoute';

@connectStore(['routerStore'])
@observer
export default class AppRouter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    Router.history = props.history;
    //props.history.block(this.loadModule);
    //props.history.listen(this.loadView);
  }

  // @autobind
  // loadView(location, action) {
  //   console.log(tx('打开页面'), location.pathname);
  //   if (Platform.OS === 'web') {
  //     nprogress.done();
  //   }
  // }

  // @autobind
  // loadModule(location, action) {
  //   if (Platform.OS === 'web') {
  //     nprogress.start();
  //   }
  //   const route = this.props.routerStore.getRoutes('/').find(item =>
  //     matchPath(location.pathname, item));
  //   if (!route) {
  //     // 不存在的路径需要返回404
  //     return true;
  //   }
  //   if (Bundle.hasLoaded(route.ns)) {
  //     return true;
  //   }
  //   const bundle = Bundle.getBundle(route.ns);
  //   if (!bundle) {
  //     return true;
  //   }
  //   this.setState({
  //     bundles: [bundle],
  //     moduleLoading: true
  //   });
  //   return false;
  // }

  @autobind
  handlePlanformLoaded() {
    this.setState({
      platformSuccess: true
    });
  }

  @autobind
  handleModuleLoaded(bundles) {
    if (this.state.bundles === bundles) {
      this.setState({
        moduleLoading: false
      });
    }
  }

  render() {
    const { history, location } = this.props;
    const props = { history, location };
    if (this.state.moduleLoading) {
      return <ModuleLoading {...props} onComplated={this.handleModuleLoaded} bundles={this.state.bundles}/>;
    } else if (this.state.platformSuccess) {
      return (
        <Switch>
          <Route exact path='/' component={AppIntro}/>
          {this.props.routerStore.getRoutes('/').map((item) => {
            // 如果没有明确标示不验证权限，都必须登录后才能访问
            const AuthRoute = item.auth !== false ? connectAuth(item.roles)(Route) : Route;
            // if (!item.component.bundleName){
            //   item.component.bundleName = item.ns;
            // }
            return <AuthRoute {...item} key={item.path.replace(/\//g, '_')} />;
          })}
          <Route component={MessageView} code={404}/>
        </Switch>
      );
    } else {
      // 所有路由都必须先进行平台加载后才能进入
      return <PlatformLoading {...props} onComplated={this.handlePlanformLoaded}/>;
    }
  }
}
