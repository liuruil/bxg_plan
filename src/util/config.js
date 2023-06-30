const fs = require("fs");
const ora = require("ora");
const path = require("path");
const { delay } = require("./index");
const { getWebSocketDebuggerUrl } = require("../api/index");

/**
 * 设置config的配置文件
 * @param {*} webSocketDebuggerUrl
 */
function setConfigFile(webSocketDebuggerUrl) {
  const data = fs.readFileSync(
    path.resolve(__dirname, "../config/index.js"),
    "utf-8"
  );
  const reg = /ws:\/\/localhost:9222\/devtools\/browser\/[0-9a-z-]{36}/g;
  fs.writeFileSync(
    path.resolve(__dirname, "../config/index.js"),
    data.replace(reg, webSocketDebuggerUrl)
  );
}

/**
 * 初始化系统配置
 */
async function initSystemConfig() {
  const spinner = ora({
    text: "系统配置初始化...",
  }).start();
  // 拿到webSocketDebuggerUrl
  const webSocketDebuggerUrl = await getWebSocketDebuggerUrl();
  // 设置webSocketDebuggerUrl
  setConfigFile(webSocketDebuggerUrl);
  await delay(1000); //等待1000ms
  spinner.succeed("系统配置初始化完成");
  console.log("\r");
}

module.exports = {
  initSystemConfig,
};
