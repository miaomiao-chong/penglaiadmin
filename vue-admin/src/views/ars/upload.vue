<!--  -->
<template>
  <div>
    <el-form
      ref="form"
      label-width="100px"
      style="margin-top: 20px"
      class="myform"
      label-position="left"
    >
      <el-form-item label="选择类型">
        <div class="radiobox">
          <el-radio
            v-model="postdata._id"
            label="attraction"
            border
            size="medium"
            >景点</el-radio
          >
          <el-radio
            v-model="postdata._id"
            label="restaurant"
            border
            size="medium"
            >饭店</el-radio
          >
          <el-radio v-model="postdata._id" label="store" border size="medium"
            >商店</el-radio
          >
        </div>
      </el-form-item>

      <el-form-item label="名称">
        <el-input v-model="postdata.name" placeholder="请输入名称" />
      </el-form-item>

      <el-form-item label="描述">
        <el-input
          type="textarea"
          v-model="postdata.information"
          placeholder="请新的输入描述信息"
        />
      </el-form-item>
      <el-form-item label="经纬度">
        <span style="margin: 0 5px">经度:</span>
        <el-input-number
          v-model="postdata.address.e"
          placeholder="输入数字"
          type="number"
          style="width: 150px"
        />
        <span style="margin: 0 5px">纬度:</span>
        <el-input-number
          v-model="postdata.address.n"
          placeholder="输入数字"
          style="width: 150px"
        />
      </el-form-item>

      <el-form-item label="上传图片">
        <el-upload
          drag
          class="upload-demo"
          :action="action"
          :on-remove="handleRemove"
          :headers="auth"
          :on-success="uploadimgSuccess"
          :on-change="handleChange"
          :on-error="errorhandler"
          :file-list="fileList"
        >
          <div style="color: gray; margin-top: 50px; font-size: 14px">
            点击或拖拽上传图片
          </div>

          <div slot="tip" class="el-upload__tip">
            上传图片前请确认“选择类型”已勾选且勾选正确，如类型勾选错误且已上传图片，<br />请点击此文字下方的文件列表的叉叉按钮，之后选中正确的类型，重新上传
          </div>
        </el-upload>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" style="margin: 0 65px" @click="confirm"
          >确定</el-button
        >
        <el-button type="info" @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { removeimg, upload } from "@/api/ars";
import { getToken } from "@/utils/auth";
// const fields = {
//   name: "名称",
//   information: "描述",
// };
export default {
  data() {
    // 失效了 后面再修
    // const validateRequire = (rule, value, callback) => {
    //   //console.log("---------rule", rule);
    //   if (value === "" || !value) {
    //     callback(new Error(fields[rule.field] + "必须填写"));
    //   } else {
    //     callback();
    //   }
    // };

    return {
      // 失效了 后面再修
      // rules: {
      //   name: [{ validator: validateRequire }],
      //   information: [{ validator: validateRequire }],
      // },

      postdata: {
        _id: "attraction",
        imageurl: "",
        address: {
          e: null,
          n: null,
        },
        name: "",
        information: "",
      },
      fileList: [],
    };
  },
  computed: {
    auth() {
      return {
        Authorization: "Bearer " + getToken(),
      };
    },
    action() {
      return (
        `${process.env.VUE_APP_BASE_API}/ars/uploadimg/` + this.postdata._id
      );
    },
  },

  // 生命周期 - 创建完成（访问当前this实例）
  created() {
    //console.log();
  },
  // 生命周期 - 挂载完成（访问DOM元素）
  mounted() {},
  methods: {
    uploadimgSuccess(e) {
      //console.log(e);

      this.postdata.imageurl = e.data;
    },
    // 从云存储删除图片
    async handleRemove() {
      if (this.postdata.imageurl.length) {
        await removeimg({ fileid: this.postdata.imageurl }).then((res) => {
          //console.log(res);
        });
        this.postdata.imageurl = "";
      }
    },
    // 如果第一个已经上传了，这时候再传第二个，需要让他覆盖第一个
    async handleChange(file, fileList) {
      // //console.log("这是file", file);
      // //console.log("这是fileList", fileList);
      // 当多余一个的时候替换文件
      //console.log("fileList", fileList);
      if (fileList.length > 1) {
        // 把上一个从云存储移走
        await removeimg({ fileid: fileList[0].response.data }).then((res) => {
          //console.log(res);
        });
        // 达到第二个替换第一个的效果
        fileList.splice(0, 1);
      }
    },
    errorhandler(err, file, fileList) {
      //console.log(err.message);
      this.$message.error(JSON.parse(err.message).message);
    },
    async confirm() {
      const postdata = this.postdata;
      const data = JSON.parse(JSON.stringify(postdata));

      //console.log("--------------data", data);
      (data.address = {
        coordinates: [postdata.address.e, postdata.address.n],
        type: "Point",
      }),
        //console.log("data-----------------", data);
      await upload(data).then((res) => {
        //console.log("res------------", res);
        this.postdata.imageurl = "";
        (this.postdata.address = {}),
          (this.postdata.name = ""),
          (this.postdata.information = "");
        this.fileList = [];
      });
    },
    cancel() {
      this.handleRemove();
      this.$router.push("/a_s_r_manage/list");
    },
  },
};
</script>
<style lang='scss' scoped>
.myform {
  width: fit-content;
  margin: 0 auto;
}
// https://blog.csdn.net/m0_67391677/article/details/123352027
::v-deep .el-form-item__content {
  line-height: 25px;
}
::v-deep .el-upload-dragger {
  height: 120px;
}
</style>
