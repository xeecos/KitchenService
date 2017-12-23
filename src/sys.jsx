import os from "os";
import fs from "fs";
import path from "path";
import uuid from "uuid/v1";
import LocalStorage from "./localStorage";
import { Printer, USBAdapter, ConsoleAdapter } from "@pokusew/escpos";

export default class SystemManager {
  constructor(router) {
    const self = this;
    this.router = router;
    this.port = process.env.PORT || 8080;
    this.usersCount = 0;
    this.device = new USBAdapter();
    this.printer = new Printer(this.device);
    this.getLocalIP().then(
      (ip => {
        console.log(
          "Laser happens on http://" + ip + ":" + this.port + "/v1.0"
        );
        this.sendGitIp(ip);
      }).bind(this)
    );
    router.get("/", (req, res) => {
      res.sendFile(path.join(self.publicDir() + "/index.html"));
    });
    router.post("/attend", this.onAttend.bind(this));
    this.initUser();
  }
  printCard(index, zone, startTime, endTime, msg) {
    var memberIndex = ("00" + index).substr(-3, 3);
    this.device.open().then(() => {
      this.printer
        .font("b")
        .align("ct")
        .style("bu")
        .size(1, 1)
        .text("你是第" + memberIndex + "个订餐的小伙伴")
        .text("           ")
        .text("————————————————")
        .text("           ")
        .size(1, 1)
        .align("lt")
        .text("    就餐区")
        .text("           ")
        .size(2, 2)
        .align("ct")
        .text(zone)
        .size(1, 1)
        .text("           ")
        .align("lt")
        .text("    就餐时间：")
        .align("ct")
        .text("           ")
        .size(1, 1)
        .text(startTime + " - " + endTime)
        .text("           ")
        .text("————————————————")
        .text("           ")
        .size(1, 1)
        .align("lt")
        .text("    " + msg)
        .text("           ")
        .text("           ")
        .cut();
    });
  }
  onAttend(req, res) {
    this.usersCount++;
    this.printCard(
      this.usersCount,
      "山景峡谷",
      "11:35",
      "11:45",
      "四季度生日趴体将于2017年12月25日下午4点在烽火台举办，欢迎大家光临"
    );
    res.send("ok");
  }
  /**
   * 获取本地IP
   */
  getLocalIP() {
    return new Promise(resolve => {
      var ifaces = os.networkInterfaces();

      Object.keys(ifaces).forEach(function(ifname) {
        var alias = 0;
        ifaces[ifname].forEach(function(iface) {
          if ("IPv4" !== iface.family || iface.internal !== false) {
            return;
          }
          if (alias >= 1) {
          } else {
            return resolve(iface.address);
          }
          ++alias;
        });
      });
    });
  }
  /**
   * 获取本地端口
   */
  getLocalPort() {
    return this.port;
  }
  /**
   * 获取web公共文件夹
   */
  publicDir() {
    return path.resolve($dirname + "/../public/", "");
  }
  /**
   * 获取web路由
   */
  getRouter() {
    return this.router;
  }
  initUser() {
    if (!LocalStorage.get("user")) {
      LocalStorage.set("user", { uuid: uuid(), name: "" });
    } else {
      this.log("user exist!");
    }
  }
  getUUID() {
    var user = LocalStorage.get("user");
    if (!user) {
      LocalStorage.set("user", { uuid: uuid(), name: "" });
    }
    return user.uuid;
  }
  setName(name) {
    var user = LocalStorage.get("user");
    user.name = name;
    LocalStorage.set("user", user);
  }
  getName() {
    var user = LocalStorage.get("user");
    return user.name;
  }
  /**
   * 打印调试信息
   */
  log(...args) {
    var out = "";
    for (var i = 0; i < args.length; i++) {
      out += args[i] + " ";
    }
    console.log(out);
  }
  /**
   * 退出回调
   */
  exit() {
    this.log("exit");
  }
}
