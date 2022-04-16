<template>
  <!--增删改查按钮-->
  <div class="crud-opts">
        <span class="crud-opts-left">
             <!--左侧插槽-->
             <slot name="left"/>
             <el-button
                 v-if="crud.optShow.add"
                 class="filter-item"
                 size="mini"
                 type="primary"
                 icon="el-icon-plus"
                 v-permission="['roles:add']"
                 @click="crud.updateOperation('post')"
             >
               新增
             </el-button>
             <el-button
                 v-if="crud.optShow.edit"
                 class="filter-item"
                 size="mini"
                 type="success"
                 icon="el-icon-edit"
                 :disabled="crud.selectData.length !== 1"
                 v-permission="['roles:edit']"
                 @click="crud.updateOperation('put')"
             >
               修改
             </el-button>
             <el-button
                 v-if="crud.optShow.delete"
                 slot="reference"
                 class="filter-item"
                 type="danger"
                 icon="el-icon-delete"
                 :disabled="crud.selectData.length === 0"
                 size="mini"
                 v-permission="['roles:del']"
                 @click="crud.updateOperation('delete')"
             >
               删除
             </el-button>
             <el-button
                 v-if="crud.optShow.download"
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
</template>

<script>
import {crud} from "@/components/Crud/crud";

export default {
  mixins: [crud()],
  data() {
    return {};
  },
  methods: {},
  created() {
  }
}
</script>

<style scoped>

</style>
