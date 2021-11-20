<template>
  <div>
    <div class="head-container">
      <!--增删改查按钮-->
      <div class="crud-opts">
      <span class="crud-opts-left">
           <!--左侧插槽-->
           <slot name="left"/>
           <el-button
               v-if="optShow.add"
               class="filter-item"
               size="mini"
               type="primary"
               icon="el-icon-plus"
               v-permission="['user:add']"
               @click="updateOperation('post')"
           >
             新增
           </el-button>
           <el-button
               v-if="optShow.edit"
               class="filter-item"
               size="mini"
               type="success"
               icon="el-icon-edit"
               :disabled="selectData.length !== 1"
               v-permission="['user:edit']"
               @click="updateOperation('put')"
           >
             修改
           </el-button>
           <el-button
               v-if="optShow.delete"
               slot="reference"
               class="filter-item"
               type="danger"
               icon="el-icon-delete"
               size="mini"
               v-permission="['user:del']"
               @click="updateOperation('delete')"
           >
             删除
           </el-button>
           <el-button
               v-if="optShow.download"
               class="filter-item"
               size="mini"
               type="warning"
               icon="el-icon-download"
           >导出</el-button>
        <!--右侧-->
           <slot name="right"/>
        </span>
        <el-button-group class="crud-opts-right">
          <el-button
              size="mini"
              plain
              type="info"
              icon="el-icon-search"
          />
          <el-button
              size="mini"
              icon="el-icon-refresh"
          />
          <el-popover
              placement="bottom-end"
              width="150"
              trigger="click"
          >
            <el-button
                slot="reference"
                size="mini"
                icon="el-icon-s-grid"
            >
              <i
                  class="fa fa-caret-down"
                  aria-hidden="true"
              />
            </el-button>
            <el-checkbox
            >
              全选
            </el-checkbox>
          </el-popover>
        </el-button-group>
      </div>
    </div>
    <!--用户列表信息表格-->
    <el-table
        :data="tableData"
        style="width: 100%"
        @selection-change="handleSelectionChange">
      <el-table-column
          type="selection"
          width="55">
      </el-table-column>
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
          <el-switch ref="enabled"
                     v-model="scope.row.enabled"></el-switch>
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
          <el-button type="text" size="small">Edit</el-button>
          <el-button type="text" size="small">Delete</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--用户信息编辑弹窗-->
    <el-dialog append-to-body title="用户信息" :visible.sync="dialogFormVisible" width="680px">
      <el-form :model="form" :inline="true" size="small" label-width="66px">
        <el-form-item label="用户名">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="form.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="form.nickName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="form.gender" style="width: 178px">
            <el-radio label="男">男</el-radio>
            <el-radio label="女">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.enabled">
            <el-radio
                v-for="item in user_status"
                :label="item.value"
            >{{ item.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="部门">
          <el-select v-model="deptData" placeholder="请选择部门" ref="deptSelect">
            <el-option v-model="deptData" style="height: max-content;width: 100%;padding: 0">
              <el-tree
                  :props="props"
                  :load="loadDept"
                  lazy
                  style="width: 100%"
                  @node-click="setDept">
              </el-tree>
            </el-option>

          </el-select>
        </el-form-item>
        <el-form-item label="岗位">
          <el-select v-model="jobDatas" multiple placeholder="请选择岗位" @change="changeJob">
            <el-option v-for="item in jobs" :label="item.name" :value="item.id" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="角色" prop="roles">
          <el-select
              v-model="roleDatas"
              multiple
              placeholder="请选择角色"
              @change="changeRole"
          >
            <el-option
                v-for="item in roles"
                :key="item.name"
                :label="item.name"
                :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateUser(form)">确 定</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>

import Element from 'element-ui'
import store from "@/store"

export default {
  name: "User",
  created() {
    this.getUserInfo()
    store.dispatch('GetInfo').then(() => {
      console.log('获取用户信息成功！！！！')
      this.optShow = {
        add: true,
        edit: true,
        delete: true,
        download: true
      }
    })
  },

  data() {
    return {
      optShow: {add: false, edit: false, delete: false, download: false},
      selectData: [],
      jobDatas: [],
      roleDatas: [],
      user_status: [{label: '激活', value: true}, {label: '禁用', value: false}],
      props: {
        label: 'name',
        children: 'zones',
        isLeaf: 'leaf',
      },
      jobs: [],
      roles: [],
      deptData: {},
      depts: [],
      dialogFormVisible: false,
      tableData: [],
      form: {
        //以下是示例数据，可以删除
        username: 'testJeff520',
        email: '786500545@qq.com',
        dept: {id: 7},
        nickName: 'houky',
        id: null,
        phone: 13242842112,
        roles: [{id: 2}],
        enabled: true,
        gender: '男',
        jobs: [],
        //以下是修改用户信息才需要传给后端的，新增的时候不用
        createTime: "2021-08-17 20:00:35",
        createBy: "admin",
        updateTime: "2021-08-17 20:05:45"
      }
    }
  },
  methods: {
    //让选中的数据显示到框框里面
    mapForm(selectRow) {
      this.deptData = selectRow.dept.name
      this.roleDatas = selectRow.roles.map(value => value.id)
      this.jobDatas = selectRow.jobs.map(value => value.id)
      this.form = selectRow
    },
    //选中某一行时
    handleSelectionChange(rows) {
      this.selectData = rows
    },
    //发送新增、编辑用户请求给后端
    updateUser(data) {
      let op = this.$store.state.operation
      console.log("提交给后端/api/users接口的数据", data)
      this.$request({url: 'http://localhost:8000/api/users', method: op, data: data}).then(res => {
        console.log(op + '用户成功')
        Element.Message.success("操作成功")
        this.dialogFormVisible = false
        this.getUserInfo()
      })
    },
    //由于select组件绑定的Jobs里面只有数字组成的数组[1,2,3]，而不是对象如[{id:1},{id:2}]，需要进行转化
    changeRole() {
      this.form.roles = this.roleDatas.map(value => {
        return {id: value}
      })
    },

    //由于select组件绑定的Jobs里面只有数字组成的数组[1,2,3]，而不是对象如[{id:1},{id:2}]，需要进行转化
    changeJob() {
      this.form.jobs = this.jobDatas.map(value => {
        return {id: value}
      })
    },
    //点击部门后，改变部门框显示的值
    setDept(node) {
      this.form.dept = {id: node.id}
      this.deptData = node.name
      this.$refs.deptSelect.visible = false
    },
    // 获取弹窗内部门数据，树形组件的节点信息获取
    loadDept(node, resolve) {
      //pid代表上级部门的id
      let pid = node.level === 0 ? null : node.data.id
      this.$request.get('http://localhost:8000/api/dept', {params: {enable: true, pid}}).then(res => {
        this.depts = res.data.content
        resolve(this.depts);
      })
    },
    //点击新增、编辑、删除按钮时
    updateOperation(op) {
      if (op === 'put') this.mapForm(this.selectData[0])
      this.$store.commit('SET_OP', op)
      console.log(this.form)
      this.dialogFormVisible = op !== 'delete'
      if (op !== 'delete') this.getJobAndRole()
      else this.updateUser(this.selectData.map(value => value.id))
    },
    //获取树形组件中的岗位和角色信息
    getJobAndRole() {
      this.$request.get('http://localhost:8000/api/job?page=0&size=9999&enabled=true').then(res => {
        this.jobs = res.data.content
      })
      this.$request.get('http://localhost:8000/api/roles/all').then(res => {
        this.roles = res.data
      })
    },
    getUserInfo() {
      this.$request.get('http://localhost:8000/api/users').then(res => {
        this.tableData = res.data.content
      })
    }
  }
}
</script>

<style scoped>

</style>
