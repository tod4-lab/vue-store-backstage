<template>
  <div>
    <el-card style="margin-bottom: 20px">
      <category-select @getCategoryId="getCategoryId" :isShowTable="isShowTable"/>
    </el-card>
    <el-card style="margin-top: 20px">
      <!--   属性展示区   -->
      <div v-show="isShowTable">
        <el-button style="margin-bottom: 10px" type="primary" :disabled="!categoryId" @click="isShowTable=false">
          <i class="el-icon-plus"></i>
          添加属性
        </el-button>
        <el-table
          :data="attrList"
          border
          style="width: 100%">
          <el-table-column
            type="index"
            label="序号"
            width="180">
          </el-table-column>
          <el-table-column
            prop="attrName"
            label="属性名称"
            width="180">
          </el-table-column>
          <el-table-column
            prop="address"
            label="属性值列表">
            <template slot-scope="{row, index}">
              <el-tag size="medium" style="margin-right: 10px" closable
                      v-for="(attrValue, index) in row.attrValueList"
                      :key="attrValue.id">{{ attrValue.attrValue }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="{row, index}">
              <el-button type="primary" icon="el-icon-edit" @click="attrEditHandle(row)" circle></el-button>
              <el-button type="danger" icon="el-icon-delete" @click="attrDeleteHandler(row)" circle></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!--   添加、修改属性区   -->
      <div v-show="!isShowTable">
        <el-form :inline="true" label-width="80px">
          <el-form-item label="属性名">
            <el-input v-model="attrInfo.attrName" placeholder="请输入属性名"></el-input>
          </el-form-item>
        </el-form>
        <el-button v-show="!attrInfo.id" style="margin-bottom: 10px;" type="primary" @click="addAttrValue"
                   :disabled="!this.attrInfo.attrName">
          <i class='el-icon-plus'></i>
          添加属性值
        </el-button>
        <!--        <el-button @click="clearAndCloseAttrInfo">取消</el-button>-->

        <el-table
          :data="attrInfo.attrValueList"
          style="width: 100%;margin-top: 10px;margin-bottom: 20px"
          border>
          <el-table-column
            type="index"
            prop="date"
            label="序号"
            width="180">
          </el-table-column>
          <el-table-column
            label="属性值名称"
            width="630">
            <template slot-scope="{row, index}">
              <el-input v-if="row.isEdit"
                        ref="editInput"
                        @blur="toLook(row)"
                        @keyup.native.enter="toLook(row)"
                        v-model="row.attrValue" placeholder="请输入属性值的名称" size="medium"></el-input>
              <!--      span转换为块元素        -->
              <span v-else @click="toEdit(row)" style="display: block;cursor: pointer">{{ row.attrValue }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作">
            <el-button type="danger" icon="el-icon-delete" circle></el-button>
          </el-table-column>
        </el-table>

        <el-button @click="saveAttrInfo" type="primary">保存</el-button>
        <el-button @click="clearAndCloseAttrInfo">取消</el-button>

      </div>
    </el-card>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'
import {reqSaveAttrInfo} from "@/api/product/attr";

export default {
  name: "index",
  data() {
    return {
      categoryId: '',
      isShowTable: true,
      // 接收平台属性数据
      attrList: [],
      // 收集新增、修改属性数据
      attrInfo: {
        id: '',
        attrName: '',
        categoryId: '',
        categoryLevel: '',
        attrValueList: []
      }
    }
  },
  methods: {
    // 自定义事件的回调函数
    async getCategoryId(categoryId, level) {
      this.categoryId = categoryId
      let res = await this.$API.attr.reqAttrList(categoryId)
      if (res.code === 200) {
        this.attrList = res.data
        // 将收集属性值的类别数据改为查询到的分类id
        // 不能再data中直接修改，因为对象加载是无序的
        this.attrInfo.categoryId = this.categoryId
        this.attrInfo.categoryLevel = 3
      }
    },
    // 关闭并清除属性值收集table
    clearAndCloseAttrInfo() {
      this.attrInfo = {
        attrName: '',
        categoryId: '',
        categoryLevel: '',
        attrValueList: []
      }
      this.isShowTable = true
    },
    // 添加属性值
    addAttrValue() {
      this.attrInfo.attrValueList.push({
        id: undefined,
        attrId: this.attrInfo.id,
        attrValue: '',
        isEdit: true
      })
      this.$nextTick(() => {
        this.$refs.editInput.focus()
      })
    },
    // 修改属性
    attrEditHandle(attr) {
      // console.log(attr)
      // 使用深拷贝，只拷贝值
      // this.attrInfo = {...attr}
      this.attrInfo = cloneDeep(attr)

      this.attrInfo.attrValueList.map((item) => {
        // item.isEdit = false
        this.$set(item, 'isEdit', false)
      })

      this.isShowTable = false
    },
    // 将指定行转换为编辑模式，并实现聚焦效果
    toEdit(row) {
      row.isEdit = true
      this.$nextTick(() => {
        this.$refs.editInput.focus()
      })
    },
    // 切换查看模式，并进行trim去除开始结尾的空格以及解决重复问题
    toLook(row) {
      row.attrValue = row.attrValue.trim()
      if (row.attrValue === '') {
        this.$message("请输入正常的属性值")
        this.attrInfo.attrValueList.pop()
        return
      }
      let isRepeat = this.attrInfo.attrValueList.some((item) => {
        if (row !== item) {
          return row.attrValue === item.attrValue
        }
      })
      if (!isRepeat) {
        row.isEdit = false
      } else {
        this.$message("输入的属性值重复")
        this.attrInfo.attrValueList.pop()
      }
    },
    // 添加或修改修改商品属性
    async saveAttrInfo() {
      let res = await this.$API.attr.reqSaveAttrInfo(this.attrInfo)
      if (res.code === 200) {
        this.$message({
          message: this.attrInfo.id ? '修改成功' : '添加成功',
          type: 'success'
        })
        await this.getCategoryId(this.categoryId)
      } else {
        this.$message.error(res.message);
      }
      this.clearAndCloseAttrInfo()
    },
    // 删除属性
    async attrDeleteHandler(row) {
      // console.log(row.id)
      let res = await this.$API.attr.reqDeleteAttrInfo(row.id)
      if (res.code === 200) {
        this.$message({
          message: '删除成功',
          type: 'success'
        })
      }
      await this.getCategoryId(this.categoryId)
    }
  }
}
</script>

<style scoped>

</style>
