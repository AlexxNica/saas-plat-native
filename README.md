# saas-plat-native

saas-plat.com运行平台，技术基于React Native提供跨终端的运行支持。

## 使用

```
npm i --save saas-plat-native
```

安装需要模块：
```
npm i --save saas-plat-native-core saas-plat-native-login saas-plat-native-portal ...
```

新建一个index.js，
```js
import { AppRegistry } from 'saas-plat-native';
import { App } from 'saas-plat-native-core';
import 'saas-plat-native-login';
import 'saas-plat-native-portal';

AppRegistry.registerComponent(() => App);
```

编译五种版本到outputs文件夹

```
node node_modules/saas-plat-native/cli/index.js build index.js --output outputs --android --ios --web --windows --macos
```

参见示例项目:https://github.com/saas-plat/saas-plat-native-demo

## 特定平台的配置:

### IOS


### Android

- 在android需要生成一个证书文件，并配置gradle.properties
    // 签名
    MYAPP_RELEASE_STORE_FILE=xxxx
    MYAPP_RELEASE_KEY_ALIAS=xxxx
    MYAPP_RELEASE_STORE_PASSWORD=xxxx
    MYAPP_RELEASE_KEY_PASSWORD=xxxx

    //JPush 
    JPUSH_APPKEY: xxxxxxx
    JPUSH_APP_CHANNEL: xxxxxxx

### Windows && MAC


### Web



## 安装的模块
···
    "@exponent/react-native-navigator": "^0.4.2",
    "@remobile/react-native-splashscreen": "github:saas-plat/react-native-splashscreen",
    "@shoutem/theme": "^0.8.9",
    "ant-mobile": "0.0.0",
    "antd": "^2.8.3",
    "assert": "^1.3.0",
    "babel-polyfill": "^6.23.0",
    "core-decorators": "^0.15.0",
    "hoist-non-react-statics": "^1.2.0",
    "i18next": "^4.2.0",
    "i18next-browser-languagedetector": "^1.0.1",
    "i18next-react-native-language-detector": "^1.0.2",
    "immutable": "^3.7.6",
    "jcore-react-native": "^1.0.0",
    "jpush-react-native": "^1.5.0",
    "lodash": "^4.17.4",
    "lzwcompress": "^0.2.2",
    "mobx": "^3.0.0",
    "mobx-react": "^4.1.0",
    "nprogress": "^0.2.0",
    "query-string": "^4.3.4",
    "react": "^15.5.4",
    "react-dom": "^15.4.2",
    "react-i18next": "^2.0.0",
    "react-native": "^0.40.0",
    "react-native-blur": "^2.0.0",
    "react-native-button": "^1.4.2",
    "react-native-camera": "^1.0.0-alpha1",
    "react-native-carousel": "^0.6.1",
    "react-native-default-preference": "github:saas-plat/react-native-default-preference",
    "react-native-device-info": "^0.9.3",
    "react-native-fs": "^2.1.0-rc.1",
    "react-native-gifted-listview": "0.0.15",
    "react-native-htmlview": "^0.4.2",
    "react-native-image-picker": "^0.25.1",
    "react-native-locale-detector": "^1.0.1",
    "react-native-passcode-auth": "github:saas-plat/react-native-passcode-auth",
    "react-native-storage": "^0.1.4",
    "react-native-touch-id": "^1.2.4",
    "react-native-vector-icons": "^4.2.0",
    "react-native-video": "^0.9.0",
    "react-native-web": "0.0.97",
    "react-native-windows": "^0.43.0-rc.0",
    "react-native-zip-archive": "0.0.11",
    "react-router": "^4.1.1",
    "react-router-dom": "^4.1.1",
    "react-router-native": "^4.1.1",
    "slash": "^1.0.0",
    "socket.io-client": "^1.7.3",
    "whatwg-fetch": "^2.0.3"
···
