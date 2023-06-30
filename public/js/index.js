Vue.createApp({
  data() {
    return {
      menu: [],
      list: [],
      img: "",
      name: "",
      nickname: "",
      text: "",
      defaultActive: "0-0",
      studentsList: [],
    };
  },
  async mounted() {
    await this.getMenu();
    await this.getList();
    await this.getAllStudents();
    this.defaultActive = localStorage.getItem("active") || "0-0";
    const arr = this.defaultActive.split("-");
    this.img = this.list[this.menu[arr[0]]][arr[1]];
  },
  methods: {
    // 复制文本
    copyTexy() {
      navigator.clipboard.writeText(this.text);
      this.$notify({
        title: "成功",
        message: "复制文本成功",
        type: "success",
        position: "bottom-right",
      });
    },
    async gotoItem(i, index) {
      this.img = i;
      localStorage.setItem("active", index);
    },
    async getMenu() {
      const res = await axios.get("/courseList");
      this.menu = res.data;
    },
    async getList() {
      const res = await axios.get("/allStudentsSnapList");
      const obj = {};
      this.menu.forEach((element) => (obj[element] = []));
      this.menu.forEach((i) => {
        console.log(res.data);
        const r = res.data.filter((name) => name.includes(i));
        obj[i] = r;
      });
      this.list = obj;
    },
    async getAllStudents() {
      const { data } = await axios.get("/allStudents");
      this.studentsList = data;
    },
  },
  watch: {
    img(imgPath) {
      this.name = imgPath.split("/")[5].split(".")[0];
      const student = this.studentsList.find((item) => item.name === this.name);
      if (student) {
        let text = "";
        this.nickname = student.nickName;
        let todayCount = student.today;
        if (student.yesterday) {
          text += `昨天的单元测评有${student.yesterday}个未完成,记得补一下哈。`;
        }
        text += "\n这是今天的学习任务，";
        text += todayCount ? `包含${todayCount}个单元测评，` : "无单元测评，";
        text += "收到回复我哈@" + this.nickname;
        this.text = text;
      }
    },
  },
})
  .use(ElementPlus)
  .mount("#app");
