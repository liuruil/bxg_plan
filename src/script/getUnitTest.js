module.exports = () => {
  const unitTestCount = {
    yesterday: 0, //昨天未完成的
    today: 0, //今天需要完成的
  };

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
  // 当天的单元测评获取
  if (!dateTh) {
    //如果没有找到今天对应的元素日期
    unitTestCount.today = 0;
  } else {
    const first = dateTh.parentNode;
    const index = all.findIndex((item) => item === first);
    const count = parseInt(dateTh.getAttribute("rowspan") || 1);
    const resultElement = all
      .slice(index, index + count + 1)
      .filter(
        (item) =>
          item.innerText.includes("单元测评") ||
          item.innerText.includes("单元测试")
      );
    // 添加背景标注
    resultElement.forEach((item) => {
      item.style.backgroundColor = "darkcyan";
      item.style.color = "#fff";
    });
    unitTestCount.today = resultElement.length;
  }
  // 昨天的单元测评获取
  if (!yestdayTh) {
    unitTestCount.yesterday = 0;
  } else {
    const first = yestdayTh.parentNode;
    const index = all.findIndex((item) => item === first);
    const count = parseInt(yestdayTh.getAttribute("rowspan") || 1);
    const resultElement = all
      .slice(index, index + count + 1)
      .filter(
        (item) =>
          item.innerText.includes("单元测评") ||
          item.innerText.includes("单元测试")
      )
      .filter((item) => !item.innerText.includes("已发布\n\t\n1/1"));
    // 添加背景标注
    resultElement.forEach((item) => {
      item.style.backgroundColor = "cornflowerblue";
      item.style.color = "#fff";
    });
    unitTestCount.yesterday = resultElement.length;
  }
  return unitTestCount;
};
