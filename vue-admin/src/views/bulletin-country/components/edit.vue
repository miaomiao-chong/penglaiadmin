<!--  -->
<template>
  <div style="width: fit-content">
    <el-form
      :model="showdata"
      label-width="80px"
      style="width: 70%; margin: 20px auto"
    >
      <el-form-item label="标题">
        <el-input v-model="showdata.title"></el-input>
      </el-form-item>
      <el-form-item label="描述">   
       <el-input
          type="textarea"
          v-model="showdata.information"
          placeholder="请新的输入描述信息"
        />
      </el-form-item>

      <el-form-item label="图片">
        <el-upload
          action=""
          ref="upload"
          :show-file-list="false"
          :http-request="changeFile"
          :on-error="errorhandler"
        >
          <!-- <el-button size="small" type="primary">点击上传</el-button> -->
          <img  v-lazy="showimg" style="width: 100px; height: 100px" />
          <div slot="tip" class="el-upload__tip">{{ imguploadLoading }}</div>
        </el-upload>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">确认修改</el-button>
        <el-button type="info" @click="goback">返回</el-button>
      </el-form-item>
    </el-form>

    <!-- {{type}} -->
  </div>
</template>

<script>
import axios from "axios";
import { getToken } from "@/utils/auth";
import { getList, getImgUrl, updatedata } from "@/api/cb";
export default {
  props: {
    type: "",
  },
  data() {
    return {
      showdata: {},
      showimg: "",
      imguploadLoading: "点击图片重新上传",
    };
  },
  computed: {
    filelist(newVal) {
      //console.log("newVal", newVal);
    },
  },
  watch: {},
  //生命周期 - 创建完成（访问当前this实例）
  created() {
    this.getlist(this.type);
  },
  //生命周期 - 挂载完成（访问DOM元素）
  mounted() {},
  methods: {
    getlist(type) {
      getList({ recordName: type }).then((res) => {
        //console.log("res", res);
        this.showdata = res.data;

        this.showimg = this.getshowimg(res.data.imageurl);
      });
    },
    changeFile(file) {
      this.imguploadLoading = "正在上传中。。。， 请等待图片更新";
      //console.log("file", file);
      let fd = new FormData();
      fd.append("file", file.file); // 传文件
      fd.append(
        "data",
        JSON.stringify({
          _id:
            this.type === "countryintroduction"
              ? "countryintroduction"
              : "bulletinboard",
          fileurl: this.showdata.fileurl,
          imageurl: this.showdata.imageurl,
        })
      );
      axios({
        url: `${process.env.VUE_APP_BASE_API}/cb/uploadimg`,
        method: "post",
        headers: {
          Authorization: "Bearer " + getToken(),
        },
        data: fd,
      })
        .then((res) => {
          this.$message({
            message: "上传成功",
            type: "success",
          });
          this.imguploadLoading = "点击图片重新上传";
          let data = res.data;
          let fileid = data.data;
          //console.log("fileid_____", fileid);
          // 修改showdata里面的imageurl云存储图片地址
          this.showdata.imageurl = fileid;
          this.getshowimg(fileid);
        })
        .catch(async (err) => {
          this.$message.error(err.response.data.message);

          if (err.response.data.code === 401) {
            await this.$store.dispatch("user/logout");
            this.$router.push(`/login?redirect=${this.$route.fullPath}`);
          }
        });
    },
    async getshowimg(newVal) {
      await getImgUrl({ fileid: newVal }).then((res) => {
        //console.log("res", res.data[0].download_url);
        this.showimg = res.data[0].download_url;
      });
    },
    async onSubmit() {
      //console.log("submit");
 
      let data = {
        recordName: this.type,
        data: this.showdata,
      };
      await updatedata(data).then((res) => {
        //console.log("updatedata", res);
      });
    },
    goback() {
      this.$router.back();
    },
    errorhandler(err, file, fileList) {
      //console.log(err.message);
      this.$message.error(JSON.parse(err.message).message);
    },

  },
};
</script>
<style lang='scss' scoped>
::v-deep .el-textarea__inner {
  height: 200px;
}
</style>