import React from "react";
import ReactDOM from "react-dom";
import $ from "jquery";
import { BrowserRouter, Route, Router, Link } from "react-router-dom";
import {
  Menu,
  Icon,
  Slider,
  Switch,
  Radio,
  Button,
  Upload,
  Checkbox,
  InputItem,
  List,
  WhiteSpace,
  Flex
} from "antd-mobile";
import { createForm } from "rc-form";
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
import "./style/web.css";
class ResultPage extends React.Component {
  constructor() {
    super();
  }
  render() {
    return (
      <div>
        <List
          renderHeader={() => {
            "已成功提交";
          }}
        >
          {"已成功提交"}
          <Button
            type="primary"
            onClick={(() => {
              window.location = "#";
            }).bind(this)}
          >
            {"返回"}
          </Button>
        </List>
      </div>
    );
  }
}
const CheckboxItem = Checkbox.CheckboxItem;
const AgreeItem = Checkbox.AgreeItem;

class CheckTimes extends React.Component {
  onChange(val) {
    console.log(val);
  }
  render() {
    const data = [
      { value: 0, label: "早餐" },
      { value: 1, label: "中餐" },
      { value: 2, label: "晚餐" }
    ];
    return (
      <div>
        <List renderHeader={() => "餐票"}>
          {data.map(i => (
            <CheckboxItem
              checked
              key={i.value}
              onChange={() => this.onChange(i.value)}
            >
              {i.label}
            </CheckboxItem>
          ))}
        </List>
      </div>
    );
  }
}

class Home extends React.Component {
  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log("Received values of form: ", values);
      }
    });
  }
  normFile(e) {
    console.log("Upload event:", e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  }
  submitOrder() {
    $.post("/v1.0/attend", () => {
      console.log("successful!");
      window.location = "#result";
    });
  }
  render() {
    const { getFieldProps } = this.props.form;
    return (
      <div>
        <List
          renderHeader={() => {
            "数字食堂 v1.0";
          }}
        >
          <InputItem placeholder="2017年12月25日" clear editable={false}>
            就餐时间
          </InputItem>
          <InputItem
            {...getFieldProps("money2", {
              normalize: (v, prev) => {
                if (v && !/^(([1-9]\d*)|0)(\.\d{0,2}?)?$/.test(v)) {
                  if (v === ".") {
                    return "0.";
                  }
                  return prev;
                }
                return v;
              }
            })}
            type={"number"}
            placeholder="10000"
            ref={el => (this.customFocusInst = el)}
            clear
          >
            {"我的工号 *"}
          </InputItem>
          <WhiteSpace size="lg" />
          <CheckTimes />
          <WhiteSpace size="lg" />
          <RiceSelector />
          <WhiteSpace size="lg" />
          <WhiteSpace size="lg" />
          <Button type="primary" onClick={this.submitOrder}>
            {"提交"}
          </Button>
        </List>
      </div>
    );
  }
}
const RadioItem = Radio.RadioItem;

class RiceSelector extends React.Component {
  constructor() {
    super();
    this.state = {
      value: 1
    };
  }
  onChange(value) {
    console.log("checkbox");
    this.setState({
      value
    });
  }
  render() {
    const { value } = this.state;
    const data = [
      { value: 0, label: "🍚" },
      { value: 1, label: "🍚🍚" },
      { value: 2, label: "🍚🍚🍚" }
    ];

    return (
      <div>
        <List renderHeader={() => "饭量"}>
          {data.map(i => (
            <RadioItem
              key={i.value}
              checked={value === i.value}
              onChange={() => this.onChange(i.value)}
            >
              {i.label}
            </RadioItem>
          ))}
        </List>
      </div>
    );
  }
}
const WrapperHome = createForm()(Home);
class World extends React.Component {
  constructor() {
    super();
  }
  render() {
    return (
      <div>
        <BrowserRouter>
          <Route
            render={props => {
              if (props.location.hash.indexOf("result") > -1) {
                return <ResultPage hash={props.location.hash} />;
              }
              return <NewWorld />;
            }}
          />
        </BrowserRouter>
      </div>
    );
  }
}
$(document).ready(() => {
  document.title = "点餐系统 v1.0";
});
class NewWorld extends React.Component {
  constructor() {
    super();
  }
  render() {
    return (
      <div className="content">
        <div>
          <img
            src="/assets/content.png"
            width="100%"
            onClick={() => {
              $.post("/v1.0/attend", () => {
                console.log("successful!");
                window.location = "#result";
              });
            }}
          />
        </div>
      </div>
    );
  }
}
ReactDOM.render(<World />, document.getElementById("content"));
