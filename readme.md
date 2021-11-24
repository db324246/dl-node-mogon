## dl-node-mongo

针对 `mongodb` 依赖的Api做的二次封装

| 名称 | 注释 | 参数 | 返回值 |
| -- | -- | -- | -- |
| findList | 查询列表（无分页） | collectionName, findObj = {}, sortConfig | Array |
| findPage | 查询分页 | collectionName, pagination, findObj = {}, sortConfig | Array |
| findOne | 单项查询 | collectionName, findObj | Object |
| updateOne | 单项更新 | collectionName, updateObj, findObj | -- |
| insertOne | 单项插入 | collectionName, insertObj | -- |
| remove | 单项删除 | collectionName, findObj | -- |
| aggregate | 联表查询 | collectionName, findObj, sortConfig | -- |


+ `collectionName`：数据集的名称
+ `findObj`：查询条件对象
``` javascript
const findObj = {
  id: 1
}
```
+ `pagination`：分页参数对象
``` javascript
const pagination = {
  pageNumber: 1,
  pageSize: 10
}
```
+ `sortConfig`：排序条件对象
``` javascript
const sortConfig = {
  createTime: -1 // -1 倒序 1 正序
}
```
+ `updateObj`：更新的数据对象
+ `insertObj`：插入的数据对象
