<template>
  <div>
    <!--工具栏-->
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
    <el-row :gutter="15">

      <!--角色管理-->
      <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="17" style="margin-bottom: 10px">
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <span class="role-span">角色列表</span>
          </div>
          <el-table
              :data="tableData"
              style="width: 100%"
              @selection-change="handleSelectionChange"
              @current-change="handleCurrentChange"
              highlight-current-row>
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
        </el-card>
      </el-col>

      <!-- 菜单授权 -->
      <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="7">
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <el-tooltip class="item" effect="dark" content="选择指定角色分配菜单" placement="top">
              <span class="role-span">菜单分配</span>
            </el-tooltip>
            <el-button
                v-if="optShow.edit"
                v-permission="['roles:edit']"
                :disabled="!showButton"
                :loading="menuLoading"
                icon="el-icon-check"
                size="mini"
                style="float: right; padding: 6px 9px"
                type="primary"
                @click="saveMenu"
            >保存
            </el-button>
          </div>
          <el-tree
              ref="menu"
              lazy
              :default-checked-keys="menuIds"
              :load="getMenuDatas"
              :props="defaultProps"
              show-checkbox
              check-strictly
              accordion
              node-key="id"
              @check="menuChange"
          />
        </el-card>
      </el-col>
    </el-row>


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
import {getChild} from "@/api/menu";

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
      defaultProps: {children: 'children', label: 'label', isLeaf: 'leaf'},
      currentId: 0,
      menuIds: [],
      menuLoading: false,
      showButton: false,
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
      form: {}
    }
  },
  methods: {
    // 触发单选
    handleCurrentChange(val) {
      if (val) {
        // 清空菜单的选中
        this.$refs.menu.setCheckedKeys([])
        // 保存当前的角色id
        this.currentId = val.id
        // 初始化默认选中的key
        this.menuIds = []
        val.menus.forEach(data =>
            this.menuIds.push(data.id)
        )
        this.showButton = true
      }
    },
    //选中某一行的[复选框]时触发，修改和删除角色时使用
    handleSelectionChange(rows) {
      this.selectData = rows
    },
    //当点击复选框改变菜单权限时
    menuChange(menu) {
      // 获取该节点的所有子节点，id 包含自身
      getChild(menu.id).then(childIds => {
        // 判断是否在 menuIds 中，如果存在则删除，否则添加
        if (this.menuIds.indexOf(menu.id) !== -1) {//删除
          for (let i = 0; i < childIds.length; i++) {
            const index = this.menuIds.indexOf(childIds[i])
            if (index !== -1) {
              this.menuIds.splice(index, 1)
            }
          }
        } else {//添加
          for (let i = 0; i < childIds.length; i++) {
            const index = this.menuIds.indexOf(childIds[i])
            if (index === -1) {
              this.menuIds.push(childIds[i])
            }
          }
        }
        this.$refs.menu.setCheckedKeys(this.menuIds)
      })
    },
    // 获取弹窗内菜单数据，树形组件的节点信息获取
    getMenuDatas(node, resolve) {
      //pid代表上级部门的id
      let pid = node.level === 0 ? 0 : node.data.id
      this.$request.get('api/menus/lazy', {params: {enable: true, pid}}).then(res => {
        this.menus = res
        resolve(this.menus);
      })
    },
    //保存菜单权限设置
    saveMenu() {
      this.menuLoading = true
      const role = {id: this.currentId, menus: []}
      // 得到已选中的 key 值
      this.menuIds.forEach(function (id) {
        const menu = {id: id}
        role.menus.push(menu)
      })
      this.$request.put("api/roles/menu", role).then(() => {
        Element.Message.success("保存成功")
        this.menuLoading = false
        this.getRoleList()
      }).catch(err => {
        this.menuLoading = false
        console.log(err.response.data.message)
      })
    },
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
