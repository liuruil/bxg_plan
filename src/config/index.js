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
  //页面视口显示大小
  defaultViewport: {
    width: 1920,
    height: 1080,
  },
  // 存放图片的默认路径
  baseUploadImageUrl: path.resolve(__dirname, "../../public/images"),
  // 浏览器ws地址
  browserWSEndpoint:
    "ws://localhost:9222/devtools/browser/69f904ff-a135-48d1-aed7-29bd070d70e8",
  // 页面基地址
  baseUrl:
    "https://work.boxuegu.com/education/my-course-manage/my-course/learning-plan",
  // 需要拦截的请求地址
  interceptUrl:
    "https://admin-gateway.boxuegu.com/teaching/student/learning-plan-task/page",
};
