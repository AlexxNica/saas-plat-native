import JPush from 'jpush-sdk';
import config from './JPushConfig';
const client = JPush.buildClient(config.appkey,  config.secret);

/*
//easy push
client.push().setPlatform(JPush.ALL)
    .setAudience(JPush.ALL)
    .setNotification('Hi, JPush', JPush.ios('ios alert', 'happy', 5))
    .send(function(err, res) {
        if (err) {
            console.log(err.message);
        } else {
            console.log('Sendno: ' + res.sendno);
            console.log('Msg_id: ' + res.msg_id);
        }
    });

client.push().setPlatform('ios', 'android')
    .setAudience(JPush.tag('555', '666'), JPush.alias('666,777'))
    .setNotification('Hi, JPush', JPush.ios('ios alert'), JPush.android('android alert', null, 1))
    .setMessage('msg content')
    .setOptions(null, 60)
    .send(function(err, res) {
        if (err) {
            console.log(err.message);
        } else {
            console.log('Sendno: ' + res.sendno);
            console.log('Msg_id: ' + res.msg_id);
        }
    });
*/


export default client;