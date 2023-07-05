module.exports = () => {
  const unitTestCount = {
    yesterday: 0, //昨天未完成的
    today: 0, //今天需要完成的
  };

  /**
   * 获取到全部单元测评元素之后的回调处理
   *
   * @callback elementCallback
   * @param {HTMLElement[]} resultElement
   */
  /**
   * 获取某天的单元测评数量
   * @param {HTMLElement} dayTh - 当天的表格element日期元素
   * @param {elementCallback} callback - 获取到全部单元测评元素之后的回调处理
   */
  function getSomeDayUnitTest(dayTh, callback) {
    // 昨天的单元测评获取
    if (!dayTh) return 0;
    const first = dayTh.parentNode;
    const index = all.findIndex((item) => item === first);
    const count = parseInt(dayTh.getAttribute("rowspan") || 0);
    resultElement = all.slice(index, index + count);
    if (dayTh.innerText === getDateRange()[0]) {
      resultElement.forEach((item) => {
        item.style.backgroundColor = "#3E7BFA";
        item.style.color = "#fff";
      });
    }
    console.log(resultElement);
    resultElement = resultElement.filter(
      (item) =>
        item.innerText.includes("单元测评") ||
        item.innerText.includes("单元测试")
    );
    callback && (resultElement = callback(resultElement));
    return resultElement.length;
  }

  function getDateRange(someday = 0) {
    var myDate = new Date();
    myDate.setDate(myDate.getDate() + someday);
    var dateArray = [];
    var dateTemp;
    var flag = 1;
    for (var i = 0; i < 7; i++) {
      var year = myDate.getFullYear();
      var month = myDate.getMonth() + 1;
      var date = myDate.getDate();
      month < 10 ? (month = "0" + month) : month;
      date < 10 ? (date = "0" + date) : date;
      dateTemp = year + "-" + month + "-" + date;
      dateArray.push(dateTemp);
      myDate.setDate(myDate.getDate() + flag);
    }
    return dateArray;
  }

  const all = [...document.querySelectorAll(".ant-table-row-level-0")];

  // 重置默认样式
  all.forEach((item) => {
    item.style.backgroundColor = "#fff";
    item.style.color = "rgba(0, 0, 0, 0.85)";
  });

  if (!all.length) {
    unitTestCount.today = 0;
    unitTestCount.yesterday = 0;
    return unitTestCount;
  }

  // 得到今天的日期单元格元素
  const dateTh = document.querySelector(
    `td[title="${getDateRange()[0]}"]:first-child`
  );

  // 得到昨天的日期单元格元素
  const yestdayTh = document.querySelector(
    `td[title="${getDateRange(-1)[0]}"]:first-child`
  );

  // 获取到今天的单元测评数量
  unitTestCount.today = getSomeDayUnitTest(dateTh, (resultElement) => {
    // 添加背景标注
    resultElement.forEach((item) => {
      item.style.backgroundColor = "#F56C6C";
      item.style.color = "#fff";
    });

    return resultElement;
  });

  // 获取到昨天的单元测评数量
  unitTestCount.yesterday = getSomeDayUnitTest(yestdayTh, (resultElement) => {
    resultElement = resultElement.filter(
      (item) => !item.innerText.includes("已发布\n\t\n1/1")
    );
    resultElement.forEach((item) => {
      item.style.backgroundColor = "#E6A23C";
      item.style.color = "#fff";
    });
    return resultElement;
  });

  return unitTestCount;
};
