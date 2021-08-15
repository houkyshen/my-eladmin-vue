<template>
    <!--用户列表信息表格-->
    <el-table
        :data="tableData"
        style="width: 100%">
      <el-table-column
          fixed
          prop="username"
          label="用户名"
          width="150">
      </el-table-column>
      <el-table-column
          prop="nickName"
          label="昵称"
          width="120">
      </el-table-column>
      <el-table-column
          prop="gender"
          label="性别"
          width="120">
      </el-table-column>
      <el-table-column
          prop="phone"
          label="电话"
          width="200">
      </el-table-column>
      <el-table-column
          prop="email"
          label="邮箱"
          width="200">
      </el-table-column>
      <el-table-column
          prop="dept.name"
          label="部门"
          width="120">
      </el-table-column>
      <el-table-column
          prop="enabled"
          label="状态"
          width="120">
        <template slot-scope="scope">
          <el-switch ref="enabled"></el-switch>
        </template>
      </el-table-column>
      <el-table-column
          :show-overflow-tooltip="true"
          prop="createTime"
          label="创建日期"
          width="200">
      </el-table-column>
      <el-table-column
          prop="operation"
          label="操作"
          width="120">
        <template slot-scope="scope">
          <el-button @click="handleClick" type="text" size="small">Edit</el-button>
          <el-button type="text" size="small">Delete</el-button>
        </template>
      </el-table-column>
    </el-table>
</template>

<script>
export default {
  name: "User",
  created() {
    this.getUserInfo()
  },
  methods:{
    getUserInfo() {
      this.$request.get('http://localhost:8000/api/users').then(res => {
        console.log(res.data);
        this.tableData = res.data.content
      })
    }
  },
  data() {
    return {
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        province: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1518 弄',
        zip: 200333
      }, {
        date: '2016-05-04',
        name: '王小虎',
        province: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1517 弄',
        zip: 200333
      }, {
        date: '2016-05-01',
        name: '王小虎',
        province: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1519 弄',
        zip: 200333
      }, {
        date: '2016-05-03',
        name: '王小虎',
        province: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1516 弄',
        zip: 200333
      }]
    }
  }
}
</script>

<style scoped>

</style>
