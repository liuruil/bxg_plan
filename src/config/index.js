const path = require("path");
module.exports = {
  // 负责的群列表(尊享无忧在前，尊享在后)
  groupList: ["【博学谷】前端就业班-尊享30期", "A-前端尊享15群"],
  // 图片裁剪配置
  snapConfig: {
    clip: {
      width: 1150,
      height: 765,
      x: 220,
      y: 377,
    },
  },
  // puppeteer连接配置
  puppeteerConnectOptions: {
    // 浏览器地址
    browserWSEndpoint:
      "ws://localhost:9222/devtools/browser/652d02a9-ca88-434c-a811-9c2d3ed6ce2c",
    // 默认窗口大小
    defaultViewport: { width: 1920, height: 1080 },
    headless: "new",
  },
  // 存放图片的默认路径
  baseUploadImageUrl: path.resolve(__dirname, "../../public/images"),
  // 学习计划页面地址
  baseUrl:
    "https://work.boxuegu.com/education/my-course-manage/my-course/learning-plan",
  // 拦截的学习计划详情请求地址
  interceptUrl:
    "https://admin-gateway.boxuegu.com/teaching/student/learning-plan-task/page",
  // 拦截搜索群对应学生请求地址
  interceptSearchUrl:
    "https://admin-gateway.boxuegu.com/teaching/myCourse/groupStudents",
};
