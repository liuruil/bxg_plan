// 尊享无忧_课程ID
const ZXWY_ID = "4438";
const ZXWY_NAME = "尊享无忧";

// 尊享_课程ID
const ZX_ID = "5573";
const ZX_NAME = "尊享";

// !所有的学生数据(必须确认数据正确)
const userData = {
  [ZXWY_ID]: {
    二十九期: [
      {
        name: "黄嘉杰",
        id: "1987506",
        nickName: "广州 黄嘉杰",
      },
      {
        name: "陶泰安",
        id: "1995463",
        nickName: "广州 黄嘉杰",
      },
      {
        name: "侯思婕",
        id: "1988234",
        nickName: "侯思婕",
      },
    ],
  },
  [ZX_ID]: {
    三期: [
      { name: "刘象军", id: "1966333", nickName: "广州 黄嘉杰" },
      // ......
    ],
    五期: [],
    七期: [],
    八期: [],
  },
};

/**
 * 获取学生ID列表
 * @param {*} userData 全部的数据
 * @param {*} type 课程类型
 * @returns
 */
function getIdListByType(userData, type) {
  return Object.values(userData[type])
    .flat()
    .map((item) => item.id);
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

module.exports = {
  userData,
  ZX: {
    courseId: ZX_ID,
    courseName: ZX_NAME,
    courseUserIdList: ZX_USER_LIST,
    courseKey: ZX_COURSE_KEY,
  },
  ZXWY: {
    courseId: ZXWY_ID,
    courseName: ZXWY_NAME,
    courseUserIdList: ZXWY_USER_LIST,
    courseKey: ZXWY_COURSE_KEY,
  },
  // 学生总数
  allStudensCount: ZXWY_USER_LIST.length + ZX_USER_LIST.length,
};
