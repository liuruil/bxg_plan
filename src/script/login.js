const ora = require("ora");
const chalk = require("chalk");
const { ZXWY } = require("../data");
const { delay } = require("../util");
const puppeteer = require("puppeteer");
const loginScript = require("../config/loginScript");
const { puppeteerConnectOptions } = require("../config");
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
async function autoProcess(page, browser) {
  console.log("\r");
  console.log(chalk.blue("点击教学实施端按钮"));
  await page.mouse.click(373, 49);
  await delay(2000); //等待2000ms
  console.log("\r");
  console.log(chalk.blue("点击尊享无忧课程"));
  await page.mouse.click(495, 320);
  await delay(2000); //等待1500ms
  console.log("\r");
  console.log(chalk.blue("移入尊享无忧学员的操作按钮"));
  await page.mouse.move(1875, 460);
  await delay(1000); //等待1500ms
  console.log("\r");
  console.log(chalk.blue("点击尊享无忧学员的学习计划"));
  await page.mouse.click(1875, 498);
  console.log("\r");
  console.log(chalk.blue("系统注入脚本..."));
  await delay(2000); //等待2000ms
  await page.evaluate(loginScript, ZXWY.courseId, ZXWY.courseUserIdList[0]);
  await delay(1000); //等待1000ms
  console.log("\r");
  console.log(chalk.blue("系统注入脚本成功，操作完成"));
  await page.close();
  await browser.disconnect();
  return;
}

module.exports = {
  login,
  sendCode,
  autoProcess,
};
