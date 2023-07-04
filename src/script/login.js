const fs = require("fs");
const {
  snapConfig,
  interceptUrl,
  interceptSearchUrl,
  puppeteerConnectOptions,
} = require("../config");
const ora = require("ora");
const path = require("path");
const chalk = require("chalk");
const puppeteer = require("puppeteer");
const getUnitTest = require("./getUnitTest");
const { getSortGroup } = require("../util/index");
const { ZXWY_ID, ZX_ID } = require("../constants");
const {
  delay,
  handleUrlQuery,
  getScreenshotPath,
  dynamicsImportFile,
} = require("../util");

// 发送验证码
async function sendCode() {
  console.log(chalk.blue("打开浏览器，进入系统登录页面"));
  console.log("\r");
  const browser = await puppeteer.connect(puppeteerConnectOptions);
  // 在浏览器窗口中加载并测试网站
  const page = await browser.newPage();
  await page.goto(
    "https://eauth.boxuegu.com/auth/realms/employee/protocol/openid-connect/auth?client_id=bxg-admin-web&redirect_uri=https%3A%2F%2Fwork.boxuegu.com%2Feducation%2Fmy-course-manage%2Fmy-course%2Flearning-plan%3FstuCourseId%3D1995401%26courseId%3D4438&state=de459a85-c858-4cb1-8800-b746b9313b2e&response_mode=fragment&response_type=code&scope=openid&nonce=052e2568-eeb5-49e3-8736-5f4c95ccb841"
  );
  const spinner = ora({
    text: "发送登录验证码中......",
  }).start();
  await delay(1000); //等待一秒
  await page.click("#spanYzCode"); //发送验证码
  spinner.succeed("登录验证码获取成功");
  console.log("\r");
  return { browser, page };
}

// 登录操作
async function login(code, page) {
  console.log("\r");
  await page.click(".yzcode-input input"); //点击输入框
  await page.keyboard.type(code); // 填充密码
  await page.click("div.btn-login"); //点击登录按钮
  const spinner = ora({
    text: "登录中......",
  }).start();
  await delay(7000); //等一段时间
  spinner.succeed("登录成功，已跳转到首页");
}

/**
 * 执行自动化操作
 * @param {*} page 浏览器标签页
 * @param {Array} groupList 学员企业微信群列表
 * @returns {Array} 学员单元测评数量
 */
function autoProcess(page, groupList) {
  return new Promise((resolve) => {
    (async () => {
      // !获取学生截图相关的变量
      let count = 0; //目前获取到第几个学生的学习计划
      let courseId = ZXWY_ID; //默认的课程类别是尊享无忧
      let coursePath = ""; // 图片保存路径
      let spinner = null; // 展示 loading
      const unitTestStudentsList = []; // 单元测评存放
      let allStusentsUserList = []; // 扁平化学生数据列表

      // !获取学生数据正确的格式的变量
      const studentList = getSortGroup(groupList);
      let groupCount = 0; // 企业群获取到第几个了
      var groupCourseId = ZXWY_ID; // 默认的课程类别是尊享无忧
      let isGetStudentList = true; // 是否在执行获取学生信息列表的操作
      // !拦截请求
      await delay(1000); //等待2000ms
      console.log(chalk.blue("\r\n点击教学实施端按钮"));
      await page.click(".ant-layout-header>div>div>div:nth-child(2)");
      await delay(2000); //等待2000ms
      console.log(chalk.blue("\r\n进入尊享无忧学员列表\r\n"));
      await page.click('[title="前端开发就业课（尊享无忧）"] a');
      console.log(chalk.blue("获取学生列表数据中..."));

      await page.setRequestInterception(true);

      // 获取单个企业微信群的学员列表的方法
      async function getStudentGroup() {
        if (++groupCount === groupList.length) {
          fs.writeFileSync(
            path.resolve(__dirname, "../data/student.json"),
            JSON.stringify(studentList)
          );
          console.log(chalk.blue("\r\n学生数据写入成功\r\n"));
          isGetStudentList = false;
          // 拿到相关数据 执行后续操作
          const { ZXWY, ZX, createScreenshotDir, userData } =
            await dynamicsImportFile(
              path.resolve(__dirname, "../util/student.js")
            );
          // 2. 创建相关文件夹，存放图片
          const [ZXWY_PATH, ZX_PATH] = await createScreenshotDir();
          coursePath = ZXWY_PATH;
          allStusentsUserList = [
            ...ZXWY.courseUserIdList,
            ...ZX.courseUserIdList,
          ];
          await getStudentSource(ZXWY, userData, ZX_PATH);
          return;
        }
        await delay(3000);
        // Cannot convert undefined or null to object
        if (groupCount === Object.keys(studentList[ZXWY_ID]).length)
          groupCourseId = ZX_ID;
        await page.click(".search-common .ant-btn-primary");
      }

      // 获取单个学生的数据的方法
      async function getStudentSource(ZXWY, userData, ZX_PATH) {
        //  更改称为尊享的学员列表
        if (count === ZXWY.courseUserIdList.length) {
          courseId = ZX_ID;
          coursePath = ZX_PATH;
        }
        if (count === 0) {
          console.clear();
          spinner = ora({
            text: `${
              allStusentsUserList[count].name
            } 同学数据获取中 [${chalk.yellowBright(count + 1)} / ${chalk.green(
              allStusentsUserList.length
            )}]`,
          }).start();
          await page.click(".search-common .ant-btn-primary");
          await delay(2000); //等待三秒钟后
          await page.mouse.move(1875, 460);
          await delay(1000); //等待1500ms
          await page.mouse.click(1875, 498);
          await delay(3000);
        } else {
          await page.click(".search-common .ant-btn-primary");
          await delay(2000);
        }
        const unitTestCount = await page.evaluate(getUnitTest);
        //拿到单元测评数量
        unitTestStudentsList.push({
          name: allStusentsUserList[count].name,
          ...unitTestCount,
        });
        await delay(1000);
        await page.screenshot({
          ...snapConfig,
          quality: 100,
          path: getScreenshotPath(
            userData[courseId], // 课程对应的学员信息列表
            allStusentsUserList[count].id, // 学员ID
            coursePath // 课程的存储路径
          ),
        });
        if (++count === allStusentsUserList.length) {
          spinner.succeed("数据获取完成\r\n");
          resolve(unitTestStudentsList);
        } else {
          spinner.text = `${
            allStusentsUserList[count].name
          } 同学数据获取中 [${chalk.yellowBright(count + 1)} / ${chalk.green(
            allStusentsUserList.length
          )}]`;
          await getStudentSource(ZXWY, userData, ZX_PATH);
        }
      }

      page.on("request", async (req) => {
        // 正常获取学生截图
        let url = req.url();
        if (url.includes(interceptSearchUrl) && req.method() === "GET") {
          if (!isGetStudentList) {
            url = `${interceptSearchUrl}?pageNum=1&pageSize=20&courseIds=${courseId}&name=${allStusentsUserList[count].name}`;
          } else {
            url = `${interceptSearchUrl}?pageNum=1&pageSize=20&courseIds=${groupCourseId}&groupName=${groupList[groupCount]}`;
          }
        }
        if (
          url.includes(interceptUrl) &&
          !isGetStudentList &&
          req.method() === "GET"
        ) {
          url = handleUrlQuery(url, allStusentsUserList[count].id, courseId);
        }
        req.continue({ url });
      });

      page.on("response", async (res) => {
        if (
          res.request().method() === "GET" &&
          isGetStudentList &&
          res.url().includes(interceptSearchUrl)
        ) {
          const result = JSON.parse(await res.text()).data.records.map(
            (item) => ({
              name: item.name,
              id: item.stuCourseId,
              nickName: item.groupNickName,
            })
          );
          studentList[groupCourseId][groupList[groupCount]] = result;
          await getStudentGroup();
        }
      });
    })();
  });
}

module.exports = {
  login,
  sendCode,
  autoProcess,
};
