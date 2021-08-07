<template>
  <div style="height: 100%">
    <el-container style="height: 100%">
      <el-aside width="205px" >
        <el-menu text-color="#bfcbd9" class="sidebar-container">
          <el-submenu :index="item.name" v-for="item in menuList">
            <template slot="title">{{item.meta.title}}</template>
            <el-menu-item :index="child.name" v-for="child in item.children" style="padding-left: 5px">
              <template slot="title">{{child.meta.title}}</template>
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
          <el-table
              ref="multipleTable"
              :data="tableData"
              tooltip-effect="dark"
              style="width: 100%">
            <el-table-column
                type="selection"
                width="55">
            </el-table-column>
            <el-table-column
                label="日期"
                width="120">
              <template slot-scope="scope">{{ scope.row.date }}</template>
            </el-table-column>
            <el-table-column
                prop="name"
                label="姓名"
                width="120">
            </el-table-column>
            <el-table-column
                prop="address"
                label="地址"
                show-overflow-tooltip>
            </el-table-column>
          </el-table>
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
    getUserInfo() {
      this.$request.get('http://localhost:8000/auth/info').then(res => {
        console.log(res.data);
      }, err => err)
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
