<template>
  <div class="register-container">
    <el-form
      ref="registerForm"
      :model="registerForm"
      class="register-form"
      auto-complete="on"
      label-position="left"
      :rules="rules"
    >
      <div class="title-container">
        <h3 class="title">注册</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="registerForm.username"
          placeholder="Username"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="registerForm.password"
          :type="passwordType"
          placeholder="Password"
          name="password"
          tabindex="2"
          auto-complete="on"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon
            :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
          />
        </span>
      </el-form-item>
      <el-form-item prop="phonenum">
        <span class="svg-container">
          <!-- <svg-icon icon-class="el-icon-user-solid" /> -->
          <i class="el-icon-phone" />
        </span>
        <el-input
          ref="phonenum"
          v-model="registerForm.phonenum"
          placeholder="请输入电话号码"
          name="phonenum"
          tabindex="2"
          auto-complete="on"
        />
      </el-form-item>
      <el-form-item prop="message">
        <span class="svg-container">
          <i class="el-icon-reading" />
        </span>
        <el-input
          ref="message"
          v-model="registerForm.message"
          placeholder="请输入申请理由"
          name="message"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-button
        :loading="loading"
        type="primary"
        style="width: 32%; margin-bottom: 30px"
        @click="handleRegister"
        >点击注册</el-button
      >
      <el-button
        :loading="loading"
        type="primary"
        style="width: 33%; margin-bottom: 30px"
        @click.native.prevent="handleReset"
        >点击重置</el-button
      >
      <el-button
        :loading="loading"
        type="primary"
        style="width: 30%; margin-bottom: 30px"
        @click.native.prevent="$router.push('/login')"
        >点击返回</el-button
      >
    </el-form>
  </div>
</template>

<script>
import { register } from "../../api/user";
const fields = {
  username: "用户名",
  password: "密码",
  message: "申请理由",
  phone_num: "电话号码",
};
export default {
  name: "Register",
  data() {
    const validateRequire = (rule, value, callback) => {
      //console.log(rule)
      if (value === "" || !value) {
        callback(new Error(fields[rule.field] + "必须填写"));
      } else {
        callback();
      }
    };
    const validatephone = (rule, value, callback) => {
      // var str = "37";
      var isPhone = /^1[3-9]\d{9}$/; // 手机号码

      if (isPhone.test(value)) {
        callback();
      } else {
        callback(new Error(fields[rule.field] + "手机号码错误"));
      }
    };

    return {
      rules: {
        username: [{ validator: validateRequire }],
        password: [{ validator: validateRequire }],
        phonenum: [
          { validator: validatephone },
          { validator: validateRequire },
        ],
        message: [{ validator: validateRequire }],
      },
      registerForm: {
        username: "",
        password: "",
        phonenum: "",
        message: "",
      },

      loading: false,
      passwordType: "password",
      redirect: undefined,
      isNew: false,
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true,
    },
  },
  methods: {
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
    handleRegister() {
      this.$refs.registerForm.validate((valid, fields) => {
        if (valid) {
          // //console.log("注册按钮被点击了");
          register(this.registerForm)
            .then((res) => {
              //console.log(res)
              // this.$message({
              //   message: res.message,
              //   type: "success",
              // });
              // this.$router.push("/login");
            })
            .catch((err) => {});
        } else {
          // //console.log(fields[Object.keys(fields)[0]][0].message);
          // const message = fields[Object.keys(fields)[0]][0].message;
          // this.$message({
          //   message,
          //   type: "error",
          // });
        }
      });
    },
    handleReset() {
      this.registerForm = Object.assign({});
    },
  },
};
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .register-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.register-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;
.radio {
  margin-top: 30px;
  margin-bottom: 30px;
}
.register-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .register-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 100px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
