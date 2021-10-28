var express = require('express');
var bodyParser = require('body-parser');
var app = express();
const cors = require('cors')
const {hostIp} = require('../host')
const path = require('path')
const {defaultServerPort} = require('../config')
const host = hostIp()

const  JsonDB  =  require('node-json-db').JsonDB
const  Config =  require('node-json-db/dist/lib/JsonDBConfig').Config

var db = new JsonDB(new Config("dataBase", true, false, '/'))
const uid =  require('uid').uid

const staticPath=process.env.static ||'dist';
app.use(cors())
app.use(bodyParser.json())
const chalk = require('chalk');
const log = console.log;

// web页面
app.use(express.static(path.join(__dirname, staticPath)));

// 打印web页面发送的数据
app.post('/api/data',function(request, response){
  var content = request.body.content;
  console.log('---------接收内容-----------');
  console.log(content);
  console.log('-----------end--------------');
  response.json({
    resCode: 200
  })
 });

// 添加数据到复制区中
app.post('/api/add',function(request, response){
  var content = request.body.content;
  console.log('---------接收内容-----------');
  console.log(content);
  addData(content)
  console.log('-----------end--------------');
  response.json({
    resCode: 200
  })
 });

app.delete('/api/data', function(request, response){
  var content = request.body.content;
  removeData(content)
  response.json({
    resCode: 200
  })
})

// 添加列表数据
const addData = (content) => {
  db.reload()
  const id = uid()
  try {
    const index = db.getIndex("/list/data", content.toString(), "name")
    // 已经存在则不存储
    if (index >= 0) {
      log(chalk.yellow('the content is aleady exist'))
      return 
    }
    db.push("/list/data[]", {name: content.toString(), id}, true);
  } catch (error) {
    db.push("/list/data[]", {name: content.toString(), id}, true);
  }
  log(chalk.green('add sucessful !!'))
  log('the id is: ' + id);
  return id
}

// 移除列表数据
const removeData = (content) => {
  db.reload()
  const index = db.getIndex("/list/data", content.toString(), "name")
  if (index > -1) {
    log(chalk.green('remove sucessful !!'))
    db.delete(`/list/data[${index}]`)
    return 
  } else {
    // 如果找不到则寻找id
    const index = db.getIndex("/list/data", content.toString())
    if (index > -1) {
      log(chalk.green('remove sucessful !!'))
      db.delete(`/list/data[${index}]`)
    } else {
      log(chalk.red('the content is not found~'))
    }
  }
}

const removeAllData = () => {
  try {
    db.reload() 
    db.delete('/list/data')
    log(chalk.green('all data is removed !!'))
  } catch (error) {
    console.log(error);
  }
}

// 获取db数据
const getData = () => {
  try {
    db.reload()
    const list = db.getData("/list/data")
    console.log('the list is:');
    console.table(list);
    return list
  } catch (error) {
    return []
  }
}


// 获取列表数据
app.get('/api/list', function(request, response){
  try {
    const list = getData()
    const data = []
    list.map((item) => {
      data.push(item.name)
    })
    response.json({
      resCode: 200,
      data: data
    })
  } catch (error) {
    response.json({
      resCode: 200,
      data: []
    })
  }
})


const startServer = (port = defaultServerPort) => {
  app.listen(port, function() {
    log(chalk.red("server running",  `http://${host}:${port}`))
  }
)
}

module.exports = {
  startServer,
  addData,
  removeData,
  getData,
  removeAllData
}