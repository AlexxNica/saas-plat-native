import React from 'react';
import PropTypes from 'prop-types';
import UserStore from '../stores/User';
import NoAuth from './NoAuth';

export const connectAuth = (roles = []) => {
  return Route => class AuthedRoute extends React.Component {
    static contextTypes = {
      router: PropTypes.shape({
        history: PropTypes.object.isRequired,
        route: PropTypes.object.isRequired,
        staticContext: PropTypes.object
      })
    }

    checkAuth(props) {
      const userStore = UserStore.getStore();
      if (userStore.user == null) {
        this.context.router.history.push('/login');
      }
    }

    componentWillMount() {
      this.checkAuth(this.props);
    }

    componentWillReceiveProps(nextProps) {
      this.checkAuth(nextProps)
    }

    render() {
      const props = this.props;
      const userStore = UserStore.getStore();
      if (userStore.user == null) {
        return null;
      }
      if (!userStore.user.isInRole(roles)) {
        debugger;
        return <Route component={NoAuth} />;
      }
      return <Route {...props}/>;
    }
  };
};
