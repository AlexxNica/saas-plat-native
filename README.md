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

### 构造

1. 编译五种版本到outputs文件夹

```
node node_modules/saas-plat-native/cli/index.js build index.js --output outputs --android --ios --web --windows --macos
```

2. 支持五种屏幕尺寸

```
lg >= 1200;
md >= 992;
sm >= 768;   (建议)
xs <= 758;   (建议)
xxs <= 312;
```

生成xs手机版和>sm版web应用
```
node node_modules/saas-plat-native/cli/index.js build index.js --output outputs  --web --xs --sm
```

编译特定平台特定尺寸的代码，例如web平台的xs版本，文件命名规则: **xxxx.web.xs.js**，但是还需要提供一个其他平台使用的 **通用文件xxx.js**


参见示例项目:https://github.com/saas-plat/saas-plat-native-demo


## 模块开发

每个前端模块必须提供src和stories两部分，stories提供项目演示和开发时测试

安装依赖包：

```
npm i --save saas-plat-native saas-plat-ui
```

**saas-plat-ui**可选，一般需要基于统一的UE交互

### 代码结构：

src
  - components         // react native 组件
  - locales            // 语言包
  - mocks              // 模拟获得数据接口
  - models             // 数据模型，基于mobx
  - routers            // 前端路由定义
  - stores             // 数据控制，基于mobx
  - themes             // 主题定义
  - index.js           // 入口

### index.js
入口文件一般就是包含其他部分的注册

```js
import './locales';
import './themes';
import './stores';
import './routers';

if (__DEV__ && __MOCK__) {
  require('./mocks');
}
```
**__MOCK__**宏是启用模拟时生效


### 组件 components/xxx
组件可以通过connect连接语言包、主题、Store

```js
import React, {Component} from 'react';
import {connect} from 'saas-plat-native';
...

@connect('EditLocale', 'EditStyle', ['OrderStore', 'ViewStore'])
export default class OrderEdit extends Component {
    ...   
}
```

组件中调用语言包 **this.props.t('xxxx')**

```js
save = () => {
    this.setState({animating: true, text: this.props.t('保存单据...')});
    const data = this.props.orderStore.data;
    return data.save().then(() => {
      this.setState({animating: false});
    }).catch(err => {
      Toast.fail(err || this.props.t('订单保存失败'));
      this.setState({animating: false});
      // 阻止切换页面
      return false;
    });
  }
```

组件中调用主题定义 **this.props.style**

```
render() {
    const {style, orderStore, viewStore, location} = this.props;
    const qs = querystring.parse(location.search.substr(1));
    // 获取平台的视图定义，可以设置字段显示隐藏和顺序，用户也可以设置
    const view = viewStore.items.find(it => it.mId === qs.mId && it.name === 'view');
    const config = merge((orderStore.config.toJS()), view
      ? view.toJS()
      : {});
    return (
      <View style={style.container}>
        <Edit
          config={config}
          data={orderStore.data}
          size='xs'
          onAction={this.handleAction}/>
        <ActivityIndicator
          toast
          text={this.state.text}
          animating={this.state.animating}/>
      </View>
    );
```

组件中调用store

```js
const { orderStore, viewStore} = this.props;
```

store的名字首字母小写是因为在store注册时别名为{ orderStore: OrderStore }


### 路由 routers/index.js 
文件为每个模块注册组件访问路由

```js
import { Registry } from 'saas-plat-native';
import OrderEdit from '../components/OrderEdit';
import OrderList from '../components/OrderList';

// 路由是公共资源， purchase/order 需要去开发者平台注册
Registry.registerRoute('saas-plat-erp-purchase-order-native', () => [{
  path: '/',
  component: OrderEdit
}, {
  path: '/:id',
  component: OrderEdit
}, {
  path: '/list',
  component: OrderList
}]);
```

saas-plat-erp-purchase-order-native会被映射成/purchase/order/xxxx需要到 **平台开发者** 社区里申请  
否则前端路径会是/saas-plat-erp-purchase-order-native/xxxx

**注意** 不管短路由申请与否，路由跳转都是写模块名，会被自动转换成申请的路由，例如

```js
this.props.history.push('/portal/saas-plat-erp-purchase-order-native/' + module.id);
```


### Model && Store
数据模型和控制器，基于mobx的MVC

数据模型models/xxx

```js
import {observable, computed, action, toJS as deep} from 'mobx';

export default class OrderModel {
  store;
  id;

  oldData;

  @observable datetime;
  @observable code;

  // 扩展项
  @observable other = new Map();

  ...
}
```

Store数据控制逻辑 stores/xxx

```js
import {
  observable,
  computed,
  runInAction,
  action,
  reaction,
  autorun
} from 'mobx';
import {Server, LocalStore} from 'saas-plat-native';
import OrderModel from '../models/OrderModel';
import ViewModel from '../models/ViewModel';

const MODULE_CODE = 'saas-plat-erp-purchase-order';

export default class OrderStore {
  @observable datas = [];
  @observable config = new ViewModel(this);
  @observable currentId;

  disposer = autorun(() => {
    this.config.setDisable(this.data && !this.data.hasChanged);
  });

  // 当前订单
  @computed get data() {
    return this.datas.find(it => it.id === this.currentId);
  }

  ...
}
```

Store是需要注册后才能connect到组件

```js
import { Registry } from 'saas-plat-native';

import OrderStore from './OrderStore';

Registry.registerStore('saas-plat-erp-purchase-order-native', () => ({ orderStore: OrderStore }));
```


### 主题

主题就是react-native的主题文件

```
export default {
  container : {
    flex: 1
  },
  avatar : {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  navigationBar : {
    backgroundColor: 'transparent',
    borderBottomColor: 'transparent'
  },
  scrollable : {},
  grid : {
    backgroundColor: 'red'
  },
  moduleItem : {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  icon : {
    height: 40,
    width: 40
  },
  text : {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 120,
    color: '#111'
  }
}

```

主题需要注册才能connect

```js
import { Registry } from 'saas-plat-native';

import EditStyle from './default/EditStyle';
import ListStyle from './default/ListStyle';

Registry.registerTheme('saas-plat-erp-purchase-order-native', () => ({ EditStyle, ListStyle }));

```

上面注册的是默认主题，要是有多主题可以填写主题名称

```js
Registry.registerTheme('black','saas-plat-erp-purchase-order-native', () => ({ EditStyle, ListStyle }));
```


### 语言 locales

定义一个en语言 locales/en/xxx.js

```js
export default {
  '创建企业' : 'Introduce',
  '企业信息' : 'BaseInfo',
  '主机租用' : 'HostSelector',
  '提交申请' : 'ServerSubmit',
  '支付年费' : 'Pay',
  '成功' : 'CreateSuccess',
  '服务器' : 'ChangeServer',
  '创建' : 'CreateServer'
};

```

注册后可以connect到组件

```js
import { Registry } from 'saas-plat-native';

import EditLocale from './en/EditLocale';
import ListLocale from './en/ListLocale';

Registry.registerLocales('en', 'saas-plat-erp-purchase-order-native', () => ({ EditLocale, ListLocale }));
```

语言包 **不是** 必须的，要是只支持中文，默认直接写在组件里就行，语言包是对默认语言的翻译


### 模拟 Mock
mock 使用 axios-mock-adapter mock-socket，分别支持axios的http请求，和socket.io的通讯

```js
import {addMock, addMockSocket} from 'saas-plat-native/apis/mock/ServerMock';

addMock((mock, config) => {
  mock.onGet(config.server.query, {
    params: {
      name: 'saas-plat-erp-purchase-order'
    }
  }).reply(200, {
    errno: 0,
    data: {
      code: 'AAA-BB-001',
      detail: [
        {
          inventory_code: 'BB-CC-0099'
        }
      ],
      nochanged: true
    }
  });
});

addMockSocket((Server)=>{

});
```

参见模块代码：https://github.com/saas-plat/saas-plat-erp-native/tree/master/purchase/order-native



## 编译配置:

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



## Native模块
···
    "@exponent/react-native-navigator": "^0.4.2",
    "@remobile/react-native-splashscreen": "github:saas-plat/react-native-splashscreen",
    "react-native-blur": "^2.0.0",
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
    "react-native-touch-id": "^1.2.4",
    "react-native-vector-icons": "^4.2.0",
    "react-native-video": "^0.9.0",
    "react-native-zip-archive": "0.0.11",
···
