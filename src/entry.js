const ora = require("ora");
const chalk = require("chalk");
const inquirer = require("inquirer");
const createServer = require("./server");
const { initSystemConfig } = require("./util");
const { sendCode, login, autoProcess } = require("./script/login");
(async () => {
  // 1.初始化配置
  await initSystemConfig();
  // 2. 开始执行登录程序
  console.log(chalk.blue("🚀 开始执行登录程序"));
  console.log("\r");
  // 3. 发送验证码
  try {
    let { browser, page } = await sendCode();
    // 4. 输入验证码
    const { code } = await inquirer.prompt([
      {
        type: "input",
        name: "code",
        message: "请输入验证码: ",
      },
    ]);
    // 5. 执行登录操作
    await login(code, page);
    // 6. 执行自动化操作，获取学生数据和单元测评数量
    const unitTestStudentsList = await autoProcess(page, browser);
    // 8. 开启服务器,自动打开我的系统页面
    createServer(page, unitTestStudentsList);
  } catch (error) {
    console.log(error);
    console.log(`请重新运行此命令 \r\n${chalk.yellow("yarn start")}`);
  }
})();
