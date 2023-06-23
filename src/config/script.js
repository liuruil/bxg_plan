// 浏览器执行的脚本， 可以访问浏览器的相关api
module.exports = () => {
  const duration = 1000;
  // 设置延迟函数
  function delay(duration) {
    return new Promise((resolve) => {
      setTimeout(resolve, duration);
    });
  }

  //得到 courseId
  function getCourseId() {
    let u = location.href;
    let reg = new RegExp("(^|&)courseId=([^&]*)(&|$)");
    let r = u.substr(u.indexOf("?") + 1).match(reg);
    return r[2];
  }

  //得到 stuCourseId
  function getStuCourseId() {
    let u = location.href;
    reg = new RegExp("(^|&)stuCourseId=([^&]*)(&|$)");
    let r = u.substr(u.indexOf("?") + 1).match(reg);
    return r[2];
  }

  //设置本地存储
  async function setData() {
    // 获取到全部的学生数据
    var userlist = JSON.parse(localStorage.getItem("userlist"));
    const list = userlist.find((item) => item.type === type);
    list && (userlist = list.data); //设置userlist 为 courseId 对应的学员
    // 还没有到此类型的最后一个学员
    var index = userlist.indexOf(stuCourseId); //拿到数据对应的索引
    if (userlist[index + 1]) {
      await delay(duration);
      arr[arr.length - 1].query.stuCourseId = userlist[index + 1];
      arr[arr.length - 1].query.courseId = type;
      localStorage.setItem(
        "94921-bread-crumbs",
        JSON.stringify(JSON.stringify(arr))
      );
    } else {
      // 防止回到初始数据
      if (type === "5537") return;
      // 到其他类型的第一个学员;
      var userlist = JSON.parse(localStorage.getItem("userlist"));
      const list = userlist.find((item) => item.type !== type);
      await delay(duration);
      arr[arr.length - 1].query.stuCourseId = list.data[0];
      arr[arr.length - 1].query.courseId = list.type;
      localStorage.setItem(
        "94921-bread-crumbs",
        JSON.stringify(JSON.stringify(arr))
      );
    }
  }

  // 获取到 系统设置 courseId，stuCourseId的数据
  var json = localStorage.getItem("94921-bread-crumbs");
  var arr = JSON.parse(JSON.parse(json));

  const type = getCourseId(); //拿到courseId
  const stuCourseId = getStuCourseId(); //拿到stuCourseId

  setData();
};
