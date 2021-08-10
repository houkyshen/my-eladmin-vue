<template>
  <div style="height: 100%">
    <el-container style="height: 100%">
      <el-aside width="205px" >
        <el-menu text-color="#bfcbd9" class="sidebar-container" style="text-align: left">
          <el-submenu :index="item.name" v-for="item in menuList">
            <template slot="title">
              <svg-icon slot="prefix" :icon-class="item.meta.icon"/>
              {{item.meta.title}}
            </template>
            <el-menu-item :index="child.name" v-for="child in item.children" style="padding-left: 5px" @click="selectMenu(item.path, child.path)">
              <template slot="title">
                <svg-icon slot="prefix" :icon-class="child.meta.icon"/>
                {{child.meta.title}}
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header style="text-align: right">
          <el-dropdown>
            <i class="el-icon-setting" style="margin-right: 15px"></i>
            <span>Jeff</span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>个人信息</el-dropdown-item>
              <el-dropdown-item @click.prevent.native="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-header>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>

</template>

<script>
import {removeToken} from "@/utils/auth";
import * as Config from "@/settings";

export default {
  name: "Dashboard",
  created() {
    this.getMenus()
  },
  methods: {
    getMenus() {
      this.$request.get('http://localhost:8000/api/menus/build').then(res => {
        this.menuList = res.data
        console.log(this.menuList);
      })
    },
    logout() {
      //请求后端接口删除该用户的token，同时前端Cookies也要删除该用户的token
      this.$request.delete('http://localhost:8000/auth/logout').then(res => {
        removeToken(Config.TokenKey)
        this.$router.replace('/')
      })
    },
    selectMenu(path1, path2) {
      this.$router.replace(path1 + '/' + path2).catch(err=>err)
    }
  },
  data() {
    return {
      tableData: [{
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-08',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-06',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-07',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }],
      multipleSelection: [],
      menuList: []
    }
  }
}
</script>

<style scoped>

</style>
