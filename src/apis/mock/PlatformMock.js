import MockAdapter from 'axios-mock-adapter';
import Mock from 'mockjs';
import config from '../../config';

export function mock(axios) {

  // This sets the mock adapter on the default instance
  var mock = new MockAdapter(axios);

  axios.interceptors.request.use(config => {
    console.log(config.method + ' ' + config.url);
    return config;
  });

  mock.onGet(config.platform.connection).reply(200, {
    errno: 0,
    data: {}
  });

  mock.onGet(config.platform.assets).reply(200, {
    errno: 0,
    data: {}
  });

  mock.onPost(config.platform.log).reply(200, {errno: 0});

  mock.onGet(config.platform.account).reply(200, {
    errno: 0,
    data: {
      "id": 11001,
      "name": "testuser1",
      "profiles": {},
      "roles": [],
      "token": {
        "data": "aaaaaaaaaabbbbbbbbbbbccccccccccccccccceeeeeeeeeeeeeeeeffffffffffffffffffffffffff" +
            "ffffffffffff"
      },
      "currentServer": "server1",
      "servers": [
        {
          "id": "server1",
          "name": "server1",
          "role": "administrator",
          "options": {}
        }, {
          "id": "server2",
          "name": "server2",
          "role": "user",
          "options": {}
        }
      ]
    }
  });

  mock.onGet(config.platform.server).reply(200, {
    errno: 0,
    data: {}
  });

  mock.onGet(config.platform.module).reply(200, Mock.mock({
    errno: 0,
    'data|10': [
      {
        id: Mock.Random.integer(1000, 10000),
        name: Mock.Random.word(),
        icon: null,
        url: '/edit',
        defaultView: 'viewMode',
        text: Mock.Random.cparagraph(1, 3),
        'order|+1': 1
      }
    ]
  }));

  mock.onGet(config.platform.view).reply(200, Mock.mock({
    errno: 0,
    'data': [
      {
        id: Mock.Random.integer(1000, 10000),
        name: Mock.Random.word(5),
        text: Mock.Random.cparagraph(1, 3),
        mode: 'viewMode',
        xs: {
          title: '采购订单',
          viewMode: {
            items: [
              {
                headerText: '单据',
                items: [
                  {
                    text: '单据编号',
                    value: 'code'
                  }, {
                    text: '单据日期',
                    value: 'datetime'
                  }
                ]
              }, {
                headerText: '供应商',
                items: [
                  {
                    text: '供应商',
                    value: 'supplier_name'
                  }, {
                    text: '编码',
                    value: 'supplier_code'
                  }, {
                    text: '简称',
                    value: 'supplier_short_name'
                  }
                ]
              }, {
                headerText: '部门',
                items: []
              }, {
                headerText: '业务员',
                items: []
              }, {
                headerText: '项目',
                items: []
              }, {
                headerText: '币种',
                items: []
              }, {
                headerText: '配送',
                items: []
              }, {
                headerText: '付款',
                items: []
              }, {
                headerText: '其他',
                items: [
                  {
                    text: '来源'
                  }, {
                    text: '销售订单跟踪'
                  }
                ]
              }, {
                headerText: '明细',
                items: [
                  {
                    text: '数量',
                    value: 'quantity',
                    type: 'number'
                  }, {
                    text: '单价',
                    value: 'price'
                  }, {
                    text: '存货名称 采购单位 赠品',
                    value: 'inventory_info'
                  }, {
                    text: '税率 折扣金额',
                    value: 'amount_info'
                  }, {
                    text: '含税金额',
                    value: 'price_sum'
                  }
                ]
              }, {
                headerText: '相关',
                items: [
                  {
                    text: '制单人'
                  }, {
                    text: '审核人'
                  }, {
                    text: '审核日期'
                  }
                ]
              }
            ]
          },
          editMode: {
            items: [
              {
                headerText: '单据',
                items: [
                  {
                    text: '单据编号',
                    value: 'code',
                    required: true,
                    visible: false
                  }, {
                    text: '单据日期',
                    value: 'datetime',
                    required: true
                  }, {
                    text: '供应商',
                    value: 'supplier_name'
                  }, {
                    text: '编码',
                    value: 'supplier_code',
                    required: true,
                    visible: false
                  }, {
                    text: '简称',
                    visible: false
                  }
                ]
              }, {
                headerText: '部门',
                items: []
              }, {
                headerText: '业务员',
                items: []
              }, {
                headerText: '项目',
                items: []
              }, {
                headerText: '币种',
                items: []
              }, {
                headerText: '配送',
                items: []
              }, {
                headerText: '付款',
                items: []
              }, {
                headerText: '其他',
                items: [
                  {
                    text: '来源',
                    visible: false
                  }, {
                    text: '销售订单跟踪',
                    visible: false
                  }
                ]
              }, {
                headerText: '明细',
                // items: [   {     text: '条码',   }, {     text: '存货',   }, {     text: '采购单位',
                // } ]
              }, {
                headerText: '相关',
                items: [
                  {
                    text: '制单人',
                    visible: false
                  }, {
                    text: '审核人',
                    visible: false
                  }, {
                    text: '审核日期',
                    visible: false
                  }
                ]
              }
            ]
          }
        }
      }
    ]
  }));
}
