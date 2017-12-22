
import express from "express";
import bodyParser from "body-parser";
import SystemManager from "./sys";
/**
 * 初始化系统
 */
var router = express.Router();
var sysManager = new SystemManager(router);
var app = express();
/**
 * 设置web公共文件夹
 */
app.use(express.static($dirname + "/../public"));
/**
 * 获取post body
 */
app.use(function(req, res, next) {
  var data = new Buffer("");
  var str = "";
  var bufLen = 0;
  req.on("data", function(chunk) {
    bufLen += chunk.length;
    console.log(bufLen / 1024);
    str += chunk.toString();
    // data = Buffer.concat([data, chunk]);
  });
  req.on("end", function() {
    req.rawBody = new Buffer(str);
    next();
  });
});

/**
 * 启动http服务
 */
app.use("/v1.0", router);
var server = app.listen(sysManager.getLocalPort());

/**
 * 退出事件
 */
function exitHandler(options, err) {
  if (options.cleanup) console.log("clean");
  if (err) console.log(err.stack);
  if (options.exit) {
  }
  sysManager.exit();
  server.close();
  process.exit();
}

//do something when app is closing
process.on("exit", exitHandler.bind(null, { cleanup: true }));
//catches ctrl+c event
process.on("SIGINT", exitHandler.bind(null, { exit: true }));
// catches "kill pid" (for example: nodemon restart)
process.on("SIGUSR1", exitHandler.bind(null, { exit: true }));
process.on("SIGUSR2", exitHandler.bind(null, { exit: true }));
//catches uncaught exceptions
process.on("uncaughtException", exitHandler.bind(null, { exit: true }));
