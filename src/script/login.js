const ora = require("ora");
const chalk = require("chalk");
const puppeteer = require("puppeteer");
const { ZXWY, ZX, userData } = require("../data");
const { interceptSearchUrl } = require("../config");
const {
  puppeteerConnectOptions,
  snapConfig,
  interceptUrl,
} = require("../config");
const {
  delay,
  handleUrlQuery,
  getScreenshotPath,
  createScreenshotDir,
} = require("../util");
const getUnitTest = require("./getUnitTest");
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
  await page.mouse.click(1060, 613); //发送验证码
  spinner.succeed("登录验证码获取成功");
  console.log("\r");
  return { browser, page };
}

// 登录操作
async function login(code, page) {
  console.log("\r");
  await page.mouse.click(885, 611); //点击输入框
  await page.keyboard.type(code); // 填充密码
  await page.click("div.btn-login"); //点击登录按钮
  const spinner = ora({
    text: "登录中......",
  }).start();
  await delay(5000); //等一段时间
  spinner.succeed("登录成功，跳转到首页");
}

// 跳转到首页,执行自动点击操作
async function autoProcess(page) {
  // 先创建相应存放截图文件夹
  const [ZXWY_PATH, ZX_PATH] = await createScreenshotDir();
  const allStusentsUserList = [
    ...ZXWY.courseUserIdList,
    ...ZX.courseUserIdList,
  ];
  let count = 0;
  let courseId = ZXWY.courseId;
  let coursePath = ZXWY_PATH;
  const unitTestStudentsList = [];
  const spinner = ora({
    text: `${
      allStusentsUserList[count].name
    } 同学数据获取中 [${chalk.yellowBright(count + 1)} / ${chalk.green(
      allStusentsUserList.length
    )}]`,
  });
  // 拦截请求
  await page.setRequestInterception(true);
  page.on("request", async (req) => {
    let url = req.url();
    if (url.includes(interceptSearchUrl)) {
      url = `${interceptSearchUrl}?pageNum=1&pageSize=20&courseIds=${courseId}&name=${allStusentsUserList[count].name}`;
    }
    if (url.includes(interceptUrl)) {
      url = handleUrlQuery(url);
    }
    req.continue({ url });
  });
  console.log("\r");
  console.log(chalk.blue("点击教学实施端按钮"));
  await page.mouse.click(373, 49);
  await delay(2000); //等待2000ms
  console.log("\r");
  console.log(chalk.blue("点击尊享无忧课程"));
  await page.mouse.click(495, 320);
  while (true) {
    spinner.start();
    if (count === ZXWY.courseUserIdList.length) {
      courseId = ZX.courseId;
      coursePath = ZX_PATH;
      await page.mouse.click(277, 95);
      await delay(1500); //等待1.5秒钟后
      await page.mouse.click(494, 284);
    }
    if (count !== 0 && count !== ZXWY.courseUserIdList.length) {
      await page.mouse.click(372, 93);
    }
    await delay(2000); //等待三秒钟后
    await page.mouse.move(1875, 460);
    await delay(1000); //等待1500ms
    await page.mouse.click(1875, 498);
    await delay(3000);
    const unitTestCount = await page.evaluate(getUnitTest);
    //拿到单元测评数量
    unitTestStudentsList.push({
      name: allStusentsUserList[count].name,
      unitTestCount,
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
    count++;
    if (count === allStusentsUserList.length) {
      spinner.succeed("数据获取完成");
      console.log("\r");
      break;
    }
    await delay(1000);
    spinner.text = `${
      allStusentsUserList[count].name
    } 同学数据获取中 [${chalk.yellowBright(count + 1)} / ${chalk.green(
      allStusentsUserList.length
    )}]`;
  }
  return unitTestStudentsList;
}

module.exports = {
  login,
  sendCode,
  autoProcess,
};
