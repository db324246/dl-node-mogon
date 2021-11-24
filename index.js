const MongoDB = require('mongodb');
// 获取操作数据库ID的方法
const ObjectID = MongoDB.ObjectID;
const MongoClient = MongoDB.MongoClient;

class Mongo {
  // 单例模式，解决多次实例化实例不共享的问题
  static getInstance(config){   
    if (!Mongo.instance) {
      Mongo.instance = new Mongo(config);
    }
    return  Mongo.instance;
  }

  constructor(config) {
    this.CONFIG = config
    this.dbase = null;
    this.isConnected = false;
    this.connect()
  }

  // 连接数据库
  connect() {
    return new Promise((r, j) => {
      if (!this.isConnected) {
        const _this = this;
        MongoClient.connect(this.CONFIG.url, function(err, client) {
          if (err) return j(err)
          console.log('数据库连接成功。。。');
          _this.dbase = client.db(this.CONFIG.libraryName);
          _this.isConnected = true;
          r()
        })
      } else {
        r()
      }
    })
  }

  // 查询列表（无分页）
  findList(collectionName, findObj = {}, sortConfig) {
    const _this = this
    return this.connect().then(() => {
      return new Promise((r, j) => {
        _this.dbase.collection(collectionName)
          .find(findObj)
          .sort(sortConfig)
          .toArray(function(err, result) { // 返回集合中所有数据
            if (err) j(err);
            else r(result.map(i => {
              const res = {
                id: i._id,
                ...i
              }
              Reflect.deleteProperty(res, '_id')
              return res
            }))
          })
      })
    })
  }

  // 查询分页
  findPage(collectionName, pagination, findObj = {}, sortConfig) {
    const pageNumber = parseInt(pagination.pageNumber || 1)
    const pageSize = parseInt(pagination.pageSize || 10)
    const _this = this
    return this.connect().then(() => {
      return new Promise((r, j) => {
        _this.dbase.collection(collectionName)
          .find(findObj)
          .limit(pageSize)
          .skip((pageNumber - 1) * pageSize)
          .sort(sortConfig)
          .toArray(function(err, result) { // 返回集合中所有数据
            if (err) j(err);
            else r(result.map(i => {
              const res = {
                id: i._id,
                ...i
              }
              Reflect.deleteProperty(res, '_id')
              return res
            }))
          })
      })
    })
  }

  // 查询
  findOne(collectionName, findObj) {
    const _this = this
    return this.connect().then(() => {
      return new Promise((r, j) => {
        _this.dbase.collection(collectionName)
          .findOne(findObj, function(err, result) { // 返回集合中所有数据
            if (err) return j(err);
            if (!result) return r(result);
            const res = {
              id: result._id,
              ...result
            }
            Reflect.deleteProperty(res, '_id')

            r(res)
          })
      })
    })
  }

  // 更新
  updateOne(collectionName, updateObj, findObj) {
    const _this = this
    return this.connect().then(() => {
      return new Promise((r, j) => {
        _this.dbase.collection(collectionName)
          .updateOne(findObj, { $set:  updateObj }, function(err, result) {
            if (err) j(err);
            else r(result)
          });
      })
    })
  }

  // 插入数据
  insertOne(collectionName, insertObj) {
    const _this = this
    return this.connect().then(() => {
      return new Promise((r, j) => {
        _this.dbase.collection(collectionName)
          .insertOne(insertObj, function(err, result) {
            if (err) j(err);
            else r(result)
        })
      })
    })
  }
  
  // 删除数据
  remove(collectionName, findObj) {
    const _this = this
    return this.connect().then(() => {
      return new Promise((r, j) => {
        _this.dbase.collection(collectionName)
          .deleteOne(findObj, function(err, result) {
            if (err) j(err);
            else r(result)
          })
      })
    })
  }

  // 联表查询
  aggregate(collectionName, findObj, sortConfig) {
    const _this = this
    return this.connect().then(() => {
      return new Promise((r, j) => {
        _this.dbase.collection(collectionName)
          .aggregate(findObj)
          .sort(sortConfig)
          .toArray(function(err, result) { // 返回集合中所有数据
            if (err) j(err);
            else r(result)
          })
      })
    })
  }

  // mongodb里面查询_id需要把字符串转换成对象
  getObjectId(id) {    
    return new ObjectID(id);
  }
}


module.exports.createMongo = config => {
  if (!config.url) throw Error('missing config params: url')
  if (!config.libraryName) throw Error('missing config params: libraryName')

  return Mongo.getInstance(config)
}
