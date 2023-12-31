# 获取学生学习计划截图的工具

## 目录介绍

```text

+ public       # 静态资源
  + css        # css文件
  + images     # 存放截图
  + js         # js文件
  + index.html # 前台入口
+ src
  + api        # 接口文件
  + config     # 配置文件
  + constants  # 常量文件
  + data       # 学生数据
  + script     # 脚本文件
  + util       # 工具函数
  + entry.js   # 入口文件

```

## 命令介绍

1. 打开 chrome 浏览器远程调试端口
   - 任务管理器先结束浏览器进程，window 右键 chrome 浏览器图标，点击属性，目标字段 添加 `--remote-debugging-port=9222`，打开浏览器，直到输入`http://localhost:9222/json/version`得到响应即表示成功。
   - mac `yarn chrome` 即可
2. 填充数据

```js
// 修改 config/index.js的 groupList 选项
module.exports = {
  // 负责的群列表(尊享无忧在前，尊享在后)
  groupList: ["【博学谷】前端就业班-尊享30期", "A-前端尊享15群"],
};
```

3. yarn start
   - 输入验证码，自动进入登录页面
   - 获取群的所有学生
   - 获取学生计划截图数据
   - 自动启动服务器，打开页面
