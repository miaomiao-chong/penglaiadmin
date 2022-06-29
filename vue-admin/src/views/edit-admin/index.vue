<!--  -->
<template>
  <div>
    <!-- <el-button @click="getList">点击获取列表</el-button> -->

    <el-table
      v-loading="loading"
      :data="list"
      style="width: 90%; margin-left: 100px"
    >
      <el-table-column prop="_id" label="用户名" width="150"> </el-table-column>
      <el-table-column prop="phone_num" label="电话" width="130">
      </el-table-column>
      <el-table-column prop="admit" label="状态" width="180"> </el-table-column>
      <el-table-column prop="message" label="申请理由" width="320">
      </el-table-column>

      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.admit === 'pending'"
            @click.native.prevent="edit(scope.row._id, false)"
            type="text"
            size="small"
          >
            拒绝
          </el-button>

          <el-button
            v-if="scope.row.admit === 'pending'"
            @click.native.prevent="edit(scope.row._id, true)"
            type="text"
            size="small"
          >
            允许
          </el-button>

          <el-button
            v-if="scope.row.admit === 'admit'"
            @click.native.prevent="edit(scope.row._id, false)"
            type="text"
            size="small"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- page: 第几页  limit:一页多少个   total一共多少页 -->
    <Pagination
      :total="total"
      :page="page"
      :limit="limit"
      :page-sizes="[7]"
      @pagination="refresh"
    ></Pagination>
  </div>
</template>

<script>
import Pagination from "@/components/base/pagination";
export default {
  components: { Pagination },
  data() {
    return {
      // page与skip的关系： skip = (page-1)*limit
      page: 1,
      // 请求多少条
      limit: 7,
      total: 0,
      list: [],
      loading: false,
    };
  },
  computed: {
    listQuery() {
      return {
        limit: this.limit,
        skip: (this.page - 1) * this.limit,
      };
    },
  },

  //生命周期 - 创建完成（访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（访问DOM元素）
  mounted() {
    this.getList();
  },
  methods: {
    edit(id, admit) {
      this.$store
        .dispatch("user/edit", { id, admit })
        .then((res) => {
          //console.log(res);
          this.getList();
        })
        .catch((err) => {
          //console.log(err);
        });
    },
    // 根据listQuery获取列表
    getList() {
      this.loading = true;
      this.$store
        .dispatch("user/getList", this.listQuery)
        .then((response) => {
          const { data, pager } = response;
          //console.log(this.list, data);
          this.list = data;
          this.total = pager.Total;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    refresh(val) {
      //  log(val.page)
      this.page = val.page;
      this.getList();
    },
  },
};
</script>
<style lang='scss' scoped>
</style>