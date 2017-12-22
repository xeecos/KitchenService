import fs from "fs";
import path from "path";
let _instance = null;
export default class LocalStorage {
  constructor() {
    this.dataPath = path.resolve($dirname + "/../data/", "storage.json");
    if (fs.existsSync(this.dataPath)) {
      var str = fs.readFileSync(this.dataPath);
      if (str.length == 0) {
        str = "{}";
      }
      this._data = JSON.parse(str);
    } else {
      this._data = {};
      if (!fs.existsSync(path.resolve($dirname + "/../data/")))
        fs.mkdirSync(path.resolve($dirname + "/../data/"));
    }
    this.get.bind(this);
    this.set.bind(this);
  }
  get(key) {
    if (this._data) {
      return this._data[key];
    }
    return null;
  }
  set(key, value) {
    if (this._data) {
      this._data[key] = value;
    } else {
      this._data = {};
      this._data[key] = value;
    }
    fs.writeFileSync(this.dataPath, JSON.stringify(this._data));
  }
  static _sharedInstance() {
    if (!_instance) {
      _instance = new LocalStorage();
    }
    return _instance;
  }
  static get(key) {
    return LocalStorage._sharedInstance().get(key);
  }
  static set(key, value) {
    return LocalStorage._sharedInstance().set(key, value);
  }
}
