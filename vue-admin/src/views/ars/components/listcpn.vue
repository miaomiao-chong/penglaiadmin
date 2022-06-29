<!--  -->
<template>
  <div>
    <el-table style="padding-left: 30px" :data="showlist" v-loading="loading" height="calc(100vh - 200px )">
      <!-- <el-table-column label="图片">
        <template slot-scope="scope">
          <img
            :src="scope.row.downloadurl"
            style="width: 100px; height: 100px"
            title="点击更新图片"
          />
        </template>
      </el-table-column> -->
      <el-table-column label="图片" width="150">
        <template slot-scope="scope">
          <el-upload
            action=""
            ref="upload"
            :show-file-list="false"
            :http-request="changeFile"
            :on-error="errorhandler"
            :data="scope"
          >
            <img
              :key="scope.row.id"
              v-lazy="scope.row.downloadurl"
              style="width: 100px; height: 100px"
              title="点击更新图片"
            />
            <div slot="tip" class="el-upload__tip">点击照片进行修改</div>
          </el-upload>
        </template>
      </el-table-column>

      <el-table-column label="标题" width="200">
        <template slot-scope="scope">
          <!-- <p
            contenteditable="true"
            v-html="scope.row.name"
            @blur="scope.row.name = $event.target.innerHTML"
          ></p> -->
          <el-input v-model="scope.row.name" placeholder="请新的输入标题" />
        </template>
      </el-table-column>
      <el-table-column label="介绍" width="400">
        <template slot-scope="scope">
          <el-input
            type="textarea"
            v-model="scope.row.information"
            placeholder="请新的输入描述信息"
          />
        </template>
      </el-table-column>

      <el-table-column label="经纬度">
        <template slot-scope="scope">
          经度：
          <el-input-number
            size="mini"
            v-model="scope.row.address.coordinates[0]"
          ></el-input-number>
          <br />
          纬度：
          <el-input-number
            size="mini"
            v-model="scope.row.address.coordinates[1]"
          ></el-input-number>
        </template>
      </el-table-column>

      <el-table-column >
        <template slot="header" slot-scope="scope">
          <el-input v-model="search" size="mini" placeholder="输入关键字搜索" />
        </template>
        <template slot-scope="scope">
          <el-popover
            placement="bottom"
            title="提示"
            width="200"
            trigger="hover"
            content="请单击表格中的文字或图片进行修改，再点此按钮确认"
          >
            <el-button
              size="mini"
              slot="reference"
              @click="editConfirm(scope.$index, scope.row)"
              >确认修改</el-button
            >
          </el-popover>

          <el-popconfirm
            title="确定删除吗？"
            @onConfirm="handleDelete(scope.$index, scope.row)"
          >
            <el-button slot="reference" size="mini" type="danger"
              >删除</el-button
            >
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getList, removeItem, editItem } from "@/api/ars";

// 这个获取线上链接的接口和cb共用  不合理 以后改
import { getImgUrl } from "@/api/cb";
import axios from "axios";
import { getToken } from "@/utils/auth";
export default {
  props: {
    type: String,
  },
  data() {
    return {
      list: [],
      showlist: [],
      loading: true,
      search: "",
      // 当前修改的index
      currentindex: null,
    };
  },
  watch: {
    type: {
      async handler(newVal) {
        this.loading = true;
        await this.getlist(newVal);
        this.loading = false;
      },
      immediate: true,
    },
    search(val) {
      //console.log(val);
      let list = this.list;
      this.showlist = list.filter((item) => {
        return item.name.includes(val) || item.information.includes(val);
      });
    },
  },
  //生命周期 - 创建完成（访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（访问DOM元素）
  mounted() {},
  methods: {
    async getlist(newVal) {
      this.loading = true
      //console.log("newVal", newVal);
      let res = await getList(newVal);
      //console.log(res);
      this.loading =false
      this.showlist = res.data;
      this.list = res.data;
    },

    changeFile(file) {
      // this.currentindex =
      //console.log("-----------");
      //console.log(file);
      // 用于更新
      this.currentindex = file.data.$index;

      let row = file.data.row;
      let fd = new FormData();
      fd.append("file", file.file); // 传文件
      fd.append(
        "data",
        JSON.stringify({
          _id: this.type,
          introductionid: row.id,
          // index貌似没有什么用，还是得用id  因为搜索以后index会发生变化，这样的话和数据库里的下标就对应不上了
          // index: index,
          fileurl: row.fileurls,
          imageurl: row.imageurl,
        })
      );
      axios({
        url: `${process.env.VUE_APP_BASE_API}/ars/updateimg`,
        method: "post",
        headers: {
          Authorization: "Bearer " + getToken(),
        },
        data: fd,
      })
        .then((res) => {
          //console.log("aaaaa", res.data.data);
          this.showlist[this.currentindex].imageurl = res.data.data;

          // 获取线上链接
          getImgUrl({ fileid: res.data.data }).then((res) => {
            //console.log("res", res.data[0].download_url);
            this.showlist[this.currentindex].downloadurl =
              res.data[0].download_url;
          });

          this.$message({
            message: "上传成功",
            type: "success",
          });
        })
        .catch(async (err) => {
          //  err.response.data&&this.$message.error(err.response.data.message);
          console.dir(err);
          if (err.response.data.code === 401) {
            this.$message.error("token失效 重新登录");
            await this.$store.dispatch("user/logout");
            this.$router.push(`/login?redirect=${this.$route.fullPath}`);
          }
        });
    },
    errorhandler(e) {
      //console.log(e);
      this.$message.error("上传失败了");
    },

    async handleDelete(index, row) {
      //console.log("row-----", row);
      let data = {
        // 删除图片
        imageurl: row.imageurl,
        _id: this.type,
        introductionId: row.id,
      };
      this.loading = true;
      await removeItem(data).then(async (res) => {
        //console.log(res);
        await this.getlist(this.type);
        this.loading = false;
      });
    },

    async editConfirm(index, row) {
      this.currentindex = index;
      //console.log("row-------", row);
      let introductionItem = row

      let newintroductionItem = JSON.parse(JSON.stringify(introductionItem))
      delete newintroductionItem.downloadurl,
      delete newintroductionItem.fileurls
      let data = {
        _id: this.type,
        introductionId: row.id,
        introductionItem: newintroductionItem,
      };
      editItem(data).then((res)=>{
        //console.log("-----fdsfds-----", res);
      })
    },
  },
};
</script>
<style lang='scss' scoped>
</style>