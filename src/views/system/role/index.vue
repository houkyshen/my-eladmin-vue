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
               v-permission="['roles:add']"
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
               v-permission="['roles:edit']"
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
               v-permission="['roles:del']"
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
    <el-table
        :data="tableData"
        style="width: 100%">
      <el-table-column
          type="selection"
          width="55">
      </el-table-column>
      <el-table-column
          fixed
          prop="name"
          label="名称"
          width="150">
      </el-table-column>
      <el-table-column
          prop="dataScope"
          label="数据权限"
          width="120">
      </el-table-column>
      <el-table-column
          prop="level"
          label="角色级别"
          width="120">
      </el-table-column>
      <el-table-column
          prop="description"
          label="描述"
          width="200">
      </el-table-column>
      <el-table-column
          :show-overflow-tooltip="true"
          prop="createTime"
          label="创建日期">
      </el-table-column>
    </el-table>
    <!--角色信息编辑弹窗-->
    <el-dialog :visible.sync="dialogFormVisible" :close-on-click-modal="false" append-to-body width="520px">
      <el-form ref="form" :inline="true" :model="form" size="small" label-width="80px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="form.name" style="width: 145px;"/>
        </el-form-item>
        <el-form-item label="角色级别" prop="level">
          <el-input-number v-model.number="form.level" :min="1" controls-position="right" style="width: 145px;"/>
        </el-form-item>
        <el-form-item label="数据范围" prop="dataScope">
          <el-select v-model="form.dataScope" style="width: 145px" placeholder="请选择数据范围" @change="changeScope">
            <el-option
                v-for="item in dateScopes"
                :key="item"
                :label="item"
                :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="form.dataScope === '自定义'" label="数据权限" prop="depts">
          <treeselect
              v-model="deptDatas"
              :load-options="loadDepts"
              :options="depts"
              multiple
              style="width: 380px"
              placeholder="请选择"
          />
        </el-form-item>
        <el-form-item label="描述信息" prop="description">
          <el-input v-model="form.description" style="width: 380px;" rows="5" type="textarea"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="updateRole(form)">确认</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
import store from "@/store";
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import {getDepts} from "@/api/dept";

import {LOAD_CHILDREN_OPTIONS} from '@riophae/vue-treeselect'
import Element from "element-ui";

export default {
  name: "Role",
  components: {Treeselect},
  created() {
    //获取角色列表
    this.getRoleList()
    //获取当前登录用户的信息
    store.dispatch('GetInfo').then(() => {
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
      deptDatas: [],
      tableData: [],
      dialogFormVisible: false,
      dateScopes: ['全部', '本级', '自定义'],
      menus: [],
      depts: [],
      props: {
        label: 'title', //定义显示的变量名
        isLeaf: 'leaf',
      },
      form: {
        name: 'jeff',
        dataScope: '全部',
        description: '测试角色新增',
        level: 3,
        depts: []
      }
    }
  },
  methods: {
    //发送新增、编辑角色请求给后端
    updateRole(data) {
      let op = this.$store.state.operation
      data.depts = this.deptDatas.map(value => {
        return {id: value}
      })
      console.log("提交给后端/api/roles接口的数据", data)
      this.$request({url: 'api/roles', method: op, data: data}).then(res => {
        console.log(op + '角色成功')
        Element.Message.success("操作成功")
        this.dialogFormVisible = false
        this.getRoleList()
      })
    },
    // 获取弹窗内部门数据
    loadDepts({action, parentNode, callback}) {
      if (action === LOAD_CHILDREN_OPTIONS) {
        getDepts({enabled: true, pid: parentNode.id}).then(res => {
          parentNode.children = res.content.map(function (obj) {
            if (obj.hasChildren) {
              obj.children = null
            }
            return obj
          })
          setTimeout(() => {
            callback()
          }, 200)
        })
      }
    },
    // 获取弹窗内部门数据，树形组件的节点信息获取
    getDepts() {
      getDepts({enabled: true}).then(res => {
        this.depts = res.content.map(function (obj) {
          if (obj.hasChildren) {
            //有children字段才会显示扩展箭头，这里先赋值为null，等用户点击的时候再进行加载。
            obj.children = null
          }
          return obj;
        })
      })
    },
    changeScope() {
      if (this.form.dataScope === '自定义') {
        this.getDepts()
      }
    },
    //点击新增、编辑、删除按钮时
    updateOperation(op) {
      if (op === 'post') {
        this.dialogFormVisible = true
        this.$store.commit('SET_OP', op)
      }
    },
    getRoleList() {
      this.$request.get('api/roles/all').then(res => {
        this.tableData = res
      })
    }
  }
}
</script>

<style scoped>

</style>
