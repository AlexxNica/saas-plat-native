import assert from 'assert';
import * as apis from '../apis/ServerApis';

export default class Query {
  static cutFields(obj, schame) {
    // todo
    return obj;
  }

  static query(name, filters, fields) {
    assert(name);
    return apis.queryData(name, filters).then(result => {
      return this.cutFields(result, fields);
    });
  }
}
