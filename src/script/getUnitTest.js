module.exports = () => {
  const unitTestCount = {
    yesterday: 0, //昨天未完成的
    today: 0, //今天需要完成的
  };

  /**
   * 获取某天的单元测评数量
   * @params {HTMLElement} 当天的表格element日期元素
   * @callback {Function} 对于选中的单元测评做的相关处理(昨天的只需要未发布的)
   */
  function getSomeDayUnitTest(dayTh, callback) {
    // resultElement .filter((item) => !item.innerText.includes("已发布\n\t\n1/1"));
    // 昨天的单元测评获取
    if (!dayTh) {
      return 0;
    } else {
      const first = dayTh.parentNode;
      const index = all.findIndex((item) => item === first);
      const count = parseInt(dayTh.getAttribute("rowspan") || 1);
      resultElement = all
        .slice(index, index + count + 1)
        .filter(
          (item) =>
            item.innerText.includes("单元测评") ||
            item.innerText.includes("单元测试")
        );
      callback && (resultElement = callback(resultElement));
      // 添加背景标注
      resultElement.forEach((item) => {
        item.style.backgroundColor = "cornflowerblue";
        item.style.color = "#fff";
      });
      return resultElement.length;
    }
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

  // 重制默认样式
  all.forEach((item) => {
    item.style.backgroundColor = "#fff";
    item.style.color = "rgba(0, 0, 0, 0.85)";
  });

  if (!all.length) {
    unitTestCount.today = 0;
    unitTestCount.yesterday = 0;
    return unitTestCount;
  }

  const dateTh = document.querySelector(
    `td[title="${getDateRange()[0]}"]:first-child`
  );

  const yestdayTh = document.querySelector(
    `td[title="${getDateRange(-1)[0]}"]:first-child`
  );

  unitTestCount.today = getSomeDayUnitTest(dateTh);

  unitTestCount.yesterday = getSomeDayUnitTest(yestdayTh, (resultElement) =>
    resultElement.filter((item) => !item.innerText.includes("已发布\n\t\n1/1"))
  );
  return unitTestCount;
};
