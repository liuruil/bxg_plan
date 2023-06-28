const fs = require("fs");
const qs = require("qs");
const ora = require("ora");
const path = require("path");
const axios = require("axios");
const chalk = require("chalk");
const puppeteer = require("puppeteer");
const { ZXWY, ZX } = require("../data/index");
const { interceptUrl, baseUploadImageUrl } = require("../config");

/**
 * 拿到webSocketDebuggerUrl
 * @returns {Promise} Promise
 */
function getWebSocketDebuggerUrl() {
  return new Promise((reslove) => {
    axios.get("http://localhost:9222/json/version").then((res) => {
      reslove(res.data.webSocketDebuggerUrl);
    });
  });
}

/**
 * 设置config的配置文件
 * @param {*} webSocketDebuggerUrl
 */
function setConfigFile(webSocketDebuggerUrl) {
  const data = fs.readFileSync(
    path.resolve(__dirname, "../config/index.js"),
    "utf-8"
  );
  const reg = /ws:\/\/localhost:9222\/devtools\/browser\/[0-9a-z-]{36}/g;
  fs.writeFileSync(
    path.resolve(__dirname, "../config/index.js"),
    data.replace(reg, webSocketDebuggerUrl)
  );
}

/**
 * 初始化系统配置
 */
async function initSystemConfig() {
  const spinner = ora({
    text: "系统配置初始化...",
  }).start();
  // 拿到webSocketDebuggerUrl
  const webSocketDebuggerUrl = await getWebSocketDebuggerUrl();
  // 设置webSocketDebuggerUrl
  setConfigFile(webSocketDebuggerUrl);
  await delay(1000); //等待1000ms
  spinner.succeed("系统配置初始化完成");
  console.log("\r");
}

/**
 * 创建文件夹
 * @param {String} dirname
 * @returns
 */
function mkdirsSync(dirname) {
  if (fs.existsSync(dirname)) {
    return true;
  } else {
    if (mkdirsSync(path.dirname(dirname))) {
      fs.mkdirSync(dirname);
      return true;
    }
  }
}

/**
 * 获取所有的课程列表
 * @returns ['尊享/7期','尊享/9期',...]
 */
function getAllCourseList() {
  const pathList = [];
  for (let i = 0; i < ZXWY.courseKey.length; i++) {
    const name = ZXWY.courseKey[i];
    pathList.push(ZXWY.courseName + "/" + name);
  }
  for (let i = 0; i < ZX.courseKey.length; i++) {
    const name = ZX.courseKey[i];
    pathList.push(ZX.courseName + "/" + name);
  }
  return pathList;
}

/**
 * 创建保存截图的文件夹
 * @returns {Array} [尊享无忧,尊享] 截图保存路径
 */
async function createScreenshotDir() {
  const date = getDateRange()[0];
  const dirPath = path.resolve(baseUploadImageUrl, date);
  const ZXWY_PATH = dirPath + `/${ZXWY.courseName}`;
  const ZX_PATH = dirPath + `/${ZX.courseName}`;
  // 生成尊享无忧全部文件夹
  for (let i = 0; i < ZXWY.courseKey.length; i++) {
    const name = ZXWY.courseKey[i];
    mkdirsSync(`${ZXWY_PATH}/${name}`);
  }
  // 生成尊享全部文件夹
  for (let i = 0; i < ZX.courseKey.length; i++) {
    const name = ZX.courseKey[i];
    mkdirsSync(`${ZX_PATH}/${name}`);
  }
  return [ZXWY_PATH, ZX_PATH];
}

/**
 * 获取文件夹的所有文件
 * @param {} currentDirPath
 * @param {*} callback
 */
function walkSync(currentDirPath, callback) {
  fs.readdirSync(currentDirPath, { withFileTypes: true }).forEach(function (
    dirent
  ) {
    var filePath = path.join(currentDirPath, dirent.name);
    if (dirent.isFile()) {
      callback(filePath, dirent);
    } else if (dirent.isDirectory()) {
      walkSync(filePath, callback);
    }
  });
}

/**
 * 延时函数
 * @param {Number} duration 时间
 * @returns {Promise} Promise
 */
async function delay(duration) {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
}

/**
 * 获取一个日期范围
 * @param {Number} someday 从距离今天多少天（-1 代表从昨天开始，+1代表从明天开始）
 * @returns {Array} 日期数组
 */
function getDateRange(someday = 0) {
  var myDate = new Date();
  myDate.setDate(myDate.getDate() + someday);
  var dateArray = [];
  var dateTemp;
  var flag = 1;
  for (var i = 0; i < 7; i++) {
    var year = myDate.getFullYear();
    var month = myDate.getMonth() + 1;
    var date = myDate.getDate();
    month < 10 ? (month = "0" + month) : month;
    date < 10 ? (date = "0" + date) : date;
    dateTemp = year + "-" + month + "-" + date;
    dateArray.push(dateTemp);
    myDate.setDate(myDate.getDate() + flag);
  }
  return dateArray;
}

function mkdirsSync(dirname) {
  if (fs.existsSync(dirname)) {
    return true;
  } else {
    if (mkdirsSync(path.dirname(dirname))) {
      fs.mkdirSync(dirname);
      return true;
    }
  }
}

/**
 * 获取图片存储路径
 * @param {Array} courseStudentList 课程对应的学员信息列表
 * @param {String} stuCourseId 学员ID
 * @param {String} coursePath 课程文件夹路径
 * @returns {String} 图片存储路径
 */
function getScreenshotPath(courseStudentList, stuCourseId, coursePath) {
  // 学员的名字
  let name = "";
  const courseKey = Object.keys(courseStudentList).find((key) =>
    courseStudentList[key].some((item) => item.id === stuCourseId)
  );
  //找到对应的学生期数
  if (!courseKey) throw new Error("没有找到学员对应的期数");
  const allStudentList = Object.values(courseStudentList).flat();
  const user = allStudentList.find((student) => student.id === stuCourseId);
  user && (name = user.name);
  return `${coursePath}/${courseKey}/${name}.jpg`;
}

/**
 * 修改获取学习计划接口的参数
 * @param {String} url 需要修改的接口
 * @param {String} courseId 课程ID
 * @param {String} stuCourseId 学员ID
 * @returns {String} 修改参数后的接口
 */
function handleUrlQuery(url) {
  const dateArray = getDateRange();
  const params = url.split("?")[1];
  const query = qs.parse(params, { ignoreQueryPrefix: true });
  query.stuPlanTaskTimeStart = dateArray[0];
  query.stuPlanTaskTimeEnd = dateArray[0];
  url = `${interceptUrl}?${qs.stringify(query)}`;
  return url;
}

/**
 * !拦截请求和页面操作(勿动)
 * @param {*} page 当前浏览器标签页
 * @param {String} courseId 课程ID
 * @param {String} stuCourseId 课程学员ID
 */
async function interceptRequest(page, courseId, stuCourseId) {
  await page.setRequestInterception(true);
  // 拦截请求 获取相应学员的数据
  await page.on("request", async (req) => {
    let url = req.url();
    // url.includes() true 代表需要拦截的请求url
    url = url.includes(interceptUrl)
      ? handleUrlQuery(url, courseId, stuCourseId)
      : url;
    req.continue({ url });
  });
  // 在浏览器中执行传入函数
  // await page.evaluate(scriptFunc);
}

module.exports = {
  delay,
  getScreenshotPath,
  createScreenshotDir,
  initSystemConfig,
  walkSync,
  getDateRange,
  setConfigFile,
  getAllCourseList,
  getWebSocketDebuggerUrl,
  handleUrlQuery,
};
