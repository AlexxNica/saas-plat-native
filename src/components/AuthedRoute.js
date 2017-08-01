import React from 'react';
import PropTypes from 'prop-types';
import UserStore from '../stores/User';
import NoAuth from './NoAuth';
import { translate } from '../core/I18n';

export const connectAuth = (roles = []) => {
  return Route => translate('core.AuthedRoute')(class AuthedRoute extends React
    .Component {
      static contextTypes = {
        router: PropTypes.shape({
          history: PropTypes.object.isRequired,
          route: PropTypes.object.isRequired,
          staticContext: PropTypes.object
        })
      }

      state = {}

      checkAuth(props) {
        const userStore = UserStore.getStore();
        if (userStore.user == null) {
          console.log(this.props.t('用户未登录，跳转登录...'));
          this.setState({
            noAuth: true
          });
          this.context.router.history.push('/login?redirect=' +
            encodeURIComponent(location.pathname));
          return;
        }
        if (!userStore.user.isInRole(roles)) {
          console.log(this.props.t('用户权限验证失败'));
          this.setState({
            noAuth: true
          });
          return;
        }
        this.setState({
          noAuth: false
        });
      }

      componentWillMount() {
        this.checkAuth(this.props);
      }

      componentWillReceiveProps(nextProps) {
        this.checkAuth(nextProps)
      }

      render() {
        const props = this.props;
        if (this.state.noAuth) {
          return <Route component={NoAuth} />;
        }
        return <Route {...props}/>;
      }
    });
};
