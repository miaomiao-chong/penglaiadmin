<template>
  <div class="container">
    <el-input v-model="input" placeholder="请输入新密码" style="width:300px; margin-bottom:15px"></el-input><br>
    <el-button type="primary" @click="submit">确定</el-button>
  </div>
</template>

<script>
import {editpwd} from "@/api/user";
export default {
  data() {
    return {
      input: "",
    };
  },
  methods:{
    submit(){
      editpwd({newpwd: this.input}).then((res)=>{

      })
    }
  }
};
</script>

<style>
.container{
    margin: 30px;
}
</style>