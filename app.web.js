console.log('Welcome to SaasPlat, more visit www.saas-plat.com.');

import React from 'react';
import { Button } from 'antd';

// 加载平台组件
export default class extends React.Component {
  render(){
    return ( <div>
    <Button type="primary">Primary</Button>
    <Button>Default</Button>
    <Button type="dashed">Dashed</Button>
    <Button type="danger">Danger</Button>
  </div>);
  }
}
