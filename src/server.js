const path = require("path");
const chalk = require("chalk");
const express = require("express");
const puppeteer = require("puppeteer");
const { userData } = require("./data/index");
const { puppeteerConnectOptions } = require("./config");
const { getDateRange, walkSync, getAllCourseList } = require("./util");

function createServer(page, unitTestStudentsList) {
  const app = express();

  app.use(express.static(path.join(__dirname, "../public")));
  // 获取所有的课程名称列表
  app.get("/courseList", (req, res) => {
    res.send(getAllCourseList());
  });

  /**
   * 获取所有学生学习计划截图路径
   */
  app.get("/allStudentsSnapList", (req, res) => {
    try {
      var result = [];
      walkSync(
        path.join(__dirname, "../public/images/", getDateRange()[0]),
        (filePath) => result.push(filePath.split("public")[1])
      );
      res.send(result);
    } catch (error) {}
  });

  app.get("/allStudents", (req, res) => {
    try {
      var result = Object.values(userData)
        .map((item) => Object.values(item).flat())
        .flat()
        .map((item) => {
          const unitTestCount = unitTestStudentsList.find(
            (i) => i.name === item.name
          );
          return {
            nickName: item.nickName,
            ...unitTestCount,
          };
        });
      res.send(result);
    } catch (error) {}
  });

  app.listen(80, async () => {
    console.log(chalk.yellow("自动打开学生学习计划管理平台"));
    // 启动浏览器
    await page.goto("http://127.0.0.1");
  });
}

module.exports = createServer;
