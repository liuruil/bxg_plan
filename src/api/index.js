const axios = require("axios");

/**
 * 拿到webSocketDebuggerUrl
 * @returns {Promise} Promise
 */
async function getWebSocketDebuggerUrl() {
  const res = await axios.get("http://localhost:9222/json/version");
  return res.data.webSocketDebuggerUrl;
}

module.exports = {
  getWebSocketDebuggerUrl,
};
