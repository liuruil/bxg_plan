// 工具函数
const fs = require("fs");
const qs = require("qs");
const vm = require("vm");
const path = require("path");
const util = require("util");
const NativeModule = require("module");
fs.readFile = util.promisify(fs.readFile);
const { interceptUrl } = require("../config");
const { ZXWY_ID, ZX_ID } = require("../constants");

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

/**
 * 创建相关目录
 * @param {*} dirname 目录
 * @returns {Boolean} 是否创建成功
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
 * @returns {String} 修改参数后的接口
 */
function handleUrlQuery(url, stuCourseId, courseId) {
  const dateArray = getDateRange(-1);
  const params = url.split("?")[1];
  const query = qs.parse(params, { ignoreQueryPrefix: true });
  query.stuPlanTaskTimeStart = dateArray[0];
  query.stuCourseId = stuCourseId;
  query.courseId = courseId;
  query.stuPlanTaskTimeEnd = dateArray[dateArray.length - 1];
  url = `${interceptUrl}?${qs.stringify(query)}`;
  return url;
}

const getModuleFromString = (bundle, filename) => {
  const m = { exports: {} };
  const wrapper = NativeModule.wrap(bundle);
  const script = new vm.Script(wrapper, { filename, displayErrors: true });
  const result = script.runInThisContext(); // 此处可以指定代码的执行环境，此api在nodejs文档中有介绍
  result.call(m.exports, m.exports, require, m);
  // 执行wrapper函数，此处传入require就解决了第一种方法不能require的问题
  return m;
};

/**
 * 动态倒入文件方法
 * ! 文件中require的文件路径必须是使用这个方法的文件的相对路径
 * @param {*} path 文件路径
 * @returns
 */
async function dynamicsImportFile(path) {
  const bundle = await fs.readFile(path, "utf-8");
  const { exports } = getModuleFromString(bundle, "bundle.js");
  return exports;
}

function getSortGroup(groupList) {
  const studentList = {};
  groupList.forEach((item) => {
    const key = item;
    // const key = item.split("尊享")[1];
    if (item.includes("【博学谷】")) {
      if (studentList[ZXWY_ID]) {
        studentList[ZXWY_ID][key] = [];
      } else {
        studentList[ZXWY_ID] = {};
        studentList[ZXWY_ID][key] = [];
      }
    } else {
      if (studentList[ZX_ID]) {
        studentList[ZX_ID][key] = [];
      } else {
        studentList[ZX_ID] = {};
        studentList[ZX_ID][key] = [];
      }
    }
  });
  return studentList;
}

module.exports = {
  delay,
  walkSync,
  mkdirsSync,
  getDateRange,
  getSortGroup,
  handleUrlQuery,
  getScreenshotPath,
  dynamicsImportFile,
};
