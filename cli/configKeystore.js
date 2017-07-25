var path = require('path');
var fs = require('fs');

// android\gradle.properties
// android.useDeprecatedNdk=true
//
// // 签名
// MYAPP_RELEASE_STORE_FILE=xxxxx.keystore
// MYAPP_RELEASE_KEY_ALIAS=xxxxxxx
// MYAPP_RELEASE_STORE_PASSWORD=xxxx
// MYAPP_RELEASE_KEY_PASSWORD=xxxxxxxxx

// //JPush
const DEFAULT_JPUSH_APPKEY = 'af7af7aef587a913d6bbee06';
const DEFAULT_JPUSH_APP_CHANNEL = 'DEFAULT';

// keystore
// keytool -genkey -v -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000

var rootPath = path.dirname(__dirname);

module.exports = ({ config }) => {
  if (!fs.existsSync(config)) {
    console.log('config 文件不存在');
    return;
  }

  const json = JSON.parse(fs.readFileSync(config));

  // file: json.name + '.keystore',
  // alias: json.name,
  // storePassword: '',
  // keyPassword: ''

  if (!fs.existsSync(json.file)) {
    console.warn('config.file 文件不存在', '使用keytool创建');
    console.log(
      'keytool -genkey -v -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000'
    );
  }

  let props = '';
  const propsFile = rootPath + '/android/gradle.properties';
  if (fs.existsSync(propsFile)) {
    props = fs.readFileSync(propsFile, 'utf-8');
  }

  props = props.replace(/^(MYAPP_RELEASE_STORE_FILE\s*=\s*)(.*)$/m, '$1' +
    json.file);
  props = props.replace(/^(MYAPP_RELEASE_KEY_ALIAS\s*=\s*)(.*)$/m, '$1' +
    json.alias);
  props = props.replace(/^(MYAPP_RELEASE_STORE_PASSWORD\s*=\s*)(.*)$/m, '$1' +
    json.storePassword);
  props = props.replace(/^(MYAPP_RELEASE_KEY_PASSWORD\s*=\s*)(.*)$/m, '$1' +
    json.keyPassword);

  props = props.replace(/^(JPUSH_APPKEY\s*=\s*)(.*)$/m, '$1' + json.jpushKey ||
    DEFAULT_JPUSH_APPKEY);
  props = props.replace(/^(JPUSH_APP_CHANNEL\s*=\s*)(.*)$/m, '$1' + json.jpushChannel ||
    DEFAULT_JPUSH_APP_CHANNEL);
    
  //console.log(props)

  fs.writeFileSync(propsFile, props);
  console.log('完成');
}
