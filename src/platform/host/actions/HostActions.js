import {
  System
} from 'saasplat-native';

export const SAVE_BASEINFO = 'PLATFORM_HOST_SAVE_BASEINFO';
export const SAVE_SIMPLE_CONFIG = 'PLATFORM_HOST_SAVE_SIMPLE_CONFIG';
export const HOST_CREATE_FINISHED = 'PLATFORM_HOST_CREATE_FINISHED';

export function saveBaseInfo(baseInfo) {
  return {
    type: SAVE_BASEINFO,
    baseInfo
  };
}

export function saveHostSimpleConfig(hostConfig) {
  return {
    type: SAVE_SIMPLE_CONFIG,
    hostConfig
  };
}

export function createServer(baseInfo, hostConfig) {
  return dispatch => {
    fetch(System.getConfig('platform').server)
      .then((response) => {
        console.log('create server repsonse status ' + response.status);
        if (!response.ok)
          throw response.statusText || response.url;
        return response.json();
      }).then(json => {
        dispatch({
          type: HOST_CREATE_FINISHED,
          result: {
            success: json.errno === 0,
            message: json.errmsg,
            baseInfo: {...baseInfo,
              ...json.data
            }
          }
        });
      }).catch(err => {
        console.log('create server failed.');
        console.warn(err);
      });
  };
}
