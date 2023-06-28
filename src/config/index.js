const path = require("path");
module.exports = {
  //页面停滞几秒后截图
  duration: 3500,
  // 图片裁剪配置
  snapConfig: {
    clip: {
      width: 1150,
      height: 600,
      x: 220,
      y: 220,
    },
  },
  // puppeteer连接配置
  puppeteerConnectOptions: {
    // 浏览器地址
    browserWSEndpoint:
      "ws://localhost:9222/devtools/browser/0a64458b-3813-408d-99d9-6f29bcea476b",
    // 默认窗口大小
    defaultViewport: { width: 1920, height: 1080 },
    headless: "new",
  },
  // 存放图片的默认路径
  baseUploadImageUrl: path.resolve(__dirname, "../../public/images"),
  // 学习计划页面地址
  baseUrl:
    "https://work.boxuegu.com/education/my-course-manage/my-course/learning-plan",
  // 需要拦截的请求地址
  interceptUrl:
    "https://admin-gateway.boxuegu.com/teaching/student/learning-plan-task/page",
};
