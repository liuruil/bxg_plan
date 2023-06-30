const path = require("path");
const userData = require("../data/student.json");
const { baseUploadImageUrl } = require("../config");
const { mkdirsSync, getDateRange } = require("../util/index.js");
const { ZXWY_ID, ZXWY_NAME, ZX_ID, ZX_NAME } = require("../constants");

/**
 * 获取学生ID列表
 * @param {*} userData 全部的数据
 * @param {*} type 课程类型
 * @returns
 */
function getIdListByType(userData, type) {
  return Object.values(userData[type])
    .flat()
    .map((item) => ({ id: item.id, name: item.name }));
}

function getAllCourseKey(userData, type) {
  return Object.keys(userData[type]).flat();
}

const ZXWY_COURSE_KEY = getAllCourseKey(userData, ZXWY_ID);
const ZX_COURSE_KEY = getAllCourseKey(userData, ZX_ID);

// 尊享无忧学生ID列表
const ZXWY_USER_LIST = getIdListByType(userData, ZXWY_ID);

// 尊享学生ID列表
const ZX_USER_LIST = getIdListByType(userData, ZX_ID);

const ZX = {
  courseId: ZX_ID,
  courseName: ZX_NAME,
  courseUserIdList: ZX_USER_LIST,
  courseKey: ZX_COURSE_KEY,
};

const ZXWY = {
  courseId: ZXWY_ID,
  courseName: ZXWY_NAME,
  courseUserIdList: ZXWY_USER_LIST,
  courseKey: ZXWY_COURSE_KEY,
};

const allStudensCount = ZXWY_USER_LIST.length + ZX_USER_LIST.length;

/**
 * 获取所有的课程列表
 * @returns ['尊享/7期','尊享/9期',...]
 */
function getAllCourseList() {
  const pathList = [];
  for (let i = 0; i < ZXWY.courseKey.length; i++) {
    const name = ZXWY.courseKey[i];
    pathList.push(name);
  }
  for (let i = 0; i < ZX.courseKey.length; i++) {
    const name = ZX.courseKey[i];
    pathList.push(name);
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

module.exports = {
  ZX,
  ZXWY,
  userData,
  allStudensCount,
  getAllCourseList,
  createScreenshotDir,
};
