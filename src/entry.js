const chalk = require("chalk");
const inquirer = require("inquirer");
const createServer = require("./util/server");
const { initSystemConfig } = require("./util/config");
const { sendCode, login, autoProcess } = require("./script/login");
(async (groupList) => {
  // 1.初始化配置
  await initSystemConfig();
  console.log(chalk.blue("🚀 开始执行登录程序\r\n"));
  try {
    // 2. 发送验证码
    let { page } = await sendCode();
    console.clear();
    // 3. 输入验证码
    const { code } = await inquirer.prompt([
      {
        type: "input",
        name: "code",
        message: "请输入验证码: ",
      },
    ]);
    // 4. 执行登录操作
    await login(code, page);
    // 5. 执行自动化操作，获取学生单元测评
    const unitTestStudentsList = await autoProcess(page, groupList);
    // 6. 开启服务器,自动打开我的系统页面
    await createServer(page, unitTestStudentsList);
  } catch (error) {
    console.log(error);
    console.log(`请重新运行此命令 \r\n${chalk.yellow("yarn start")}`);
  }
})(["【博学谷】前端就业班-尊享30期", "A-前端尊享15群"]);
