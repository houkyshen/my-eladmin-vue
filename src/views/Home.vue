<template>
  <div>
    <h2>Dashboard</h2>
    <el-button @click.native.prevent="logout">注销</el-button>
    <el-button @click.native.prevent="getUserInfo">获取用户信息</el-button>
  </div>

</template>

<script>
import {removeToken} from "@/utils/auth";
import * as Config from "@/settings";

export default {
  name: "Dashboard",
  methods: {
    logout(){
      //请求后端接口删除该用户的token，同时前端Cookies也要删除该用户的token
      this.$request.delete('http://localhost:8000/auth/logout').then(res=>{
        removeToken(Config.TokenKey)
        this.$router.replace('/')
      })
    },
    getUserInfo(){
      this.$request.get('http://localhost:8000/auth/info').then(res=>{
        console.log(res.data);
      },err=> err)
    }
  }
}
</script>

<style scoped>

</style>
