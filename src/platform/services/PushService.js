import JPushModule from 'jpush-react-native';
import config from './JPushConfig';

export default {
    setup: function(){
        JPushModule.setup(config.appkey,config.channel,!__DEV__);
    }
};