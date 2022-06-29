<!--  -->
<template>
  <div>
  <edit type="bulletinboard" style="width:100%"/>
  </div>
</template>

<script>
import { getToken } from "@/utils/auth";
import edit from './components/edit'
export default {
  components:{edit},
  data() {
    return {
    
    };
  },
  //生命周期 - 创建完成（访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（访问DOM元素）
  mounted() {},
  computed: {
 
  },
  methods: {
  
  },
};
</script>
<style lang='scss' scoped>
</style>