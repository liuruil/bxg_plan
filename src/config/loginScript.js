// 浏览器执行的脚本， 可以访问浏览器的相关api
module.exports = (...args) => {
  var json = localStorage.getItem("94921-bread-crumbs");
  var arr = JSON.parse(JSON.parse(json));
  arr[arr.length - 1].query.courseId = args[0];
  arr[arr.length - 1].query.stuCourseId = args[1];
  localStorage.setItem(
    "94921-bread-crumbs",
    JSON.stringify(JSON.stringify(arr))
  );
};
