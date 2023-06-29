module.exports = () => {
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
  if (!all.length) return 0;
  const dateTh = document.querySelector(`[title="${getDateRange()[0]}"]`);
  if (!dateTh) return 0;
  const first = dateTh.parentNode;
  const index = all.findIndex((item) => item === first);
  const count = parseInt(dateTh.getAttribute("rowspan") || 1);
  const resultElement = all
    .slice(index, count + 1)
    .filter(
      (item) =>
        item.innerText.includes("单元测评") ||
        item.innerText.includes("单元测试")
    );
  // 添加背景标注
  resultElement.forEach((item) => {
    item.style.backgroundColor = "red";
    item.style.color = "#fff";
  });
  return resultElement.length;
};
