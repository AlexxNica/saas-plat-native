import * as Actions from '../actions/HostActions';

export function reducer(state, action) {
  switch (action.type) {
  case Actions.SAVE_BASEINFO:
    state = state.setIn(['baseInfo'], action.baseInfo);
    break;
  case Actions.SAVE_SIMPLE_CONFIG:
    state = state.setIn(['hostConfig'], action.baseInfo);
    break;
  case Actions.HOST_CREATE_FINISHED:
    state = state.setIn(['result'], action.result);
    break;
  }
  return state;
}
