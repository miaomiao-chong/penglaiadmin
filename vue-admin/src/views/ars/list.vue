<!--  -->
<template>
  <div>
    <el-menu
      :default-active="currentTab"
      mode="horizontal"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
      @select="handleSelect"
    >
      <el-menu-item index="attraction">景点</el-menu-item>
      <el-menu-item index="restaurant">餐厅</el-menu-item>
      <el-menu-item index="store">商店</el-menu-item>

      <el-menu-item @click="uploadItem">点击新增</el-menu-item>

    </el-menu>

    <listcpn :type="currentTab"></listcpn>
  </div>
</template>

<script>
import listcpn from './components/listcpn.vue'
export default {
  components: { listcpn },
  data() {
    return {
      // type: ["attraction", "restaurant", "store"],
      currentTab: 'attraction'

    }
  },

  watch: {

  },
  // 生命周期 - 创建完成（访问当前this实例）
  created() {},
  // 生命周期 - 挂载完成（访问DOM元素）
  mounted() {},
  methods: {
    handleSelect(key, keyPath) {
      //console.log(key, keyPath)
      this.currentTab = key
    },
    uploadItem() {
      this.$router.push('/a_s_r_manage/upload')
    }
  }
}
</script>
<style lang='scss' scoped>
</style>
