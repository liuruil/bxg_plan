const chalk = require("chalk");
const inquirer = require("inquirer");
const createServer = require("./server");
const { initSystemConfig, init } = require("./util");
const { sendCode, login, autoProcess } = require("./script/login");

const { exec } = require("child_process");
const { start } = require("repl");
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
    // 6. 执行自动化操作
    await autoProcess(page, browser);
    // 7. 获取学生截图数据
    await init();
    // 8. 开启服务器,自动打开我的系统页面
    createServer();
  } catch (error) {
    console.log(`请重新运行此命令 \r\n${chalk.yellow("yarn start")}`);
  }
})();
