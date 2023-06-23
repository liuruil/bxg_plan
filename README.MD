# 获取学生学习计划截图的工具

## 目录介绍

```text

+ public     # 静态资源
  + images     # 存放截图
  + index.html # 前台入口
+ src
  + config     # 配置文件
  + data       # 学生数据
  + util       # 工具函数
  + index.js   # 主文件
  + entry.js   # 入口文件
  + serve.js   # 后端服务

```

## 填充 data/index.js 中的学生数据

```js
const userData = {
  // 尊享的数据
  [ZX_ID]: {
    三期: [
      { name: "李四", id: "1966333", nickName: "群昵称" },
      //   ...
    ],
  },
  // 尊享的数据
  [ZXWY_ID]: {
    二十九期: [
      {
        name: "赵五",
        id: "1997102",
        nickName: "群昵称",
      },
    ],
  },
};
```

## 命令介绍

1. yarn chrome
   - 打开浏览器，登陆系统
   - 进入到第一个学生数据的学习计划页面
2. yarn start
   - 获取学生计划截图数据，并且启动服务器
