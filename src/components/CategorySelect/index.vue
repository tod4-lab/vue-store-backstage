<template>
  <div>
    <el-form :inline="true" class="demo-form-inline" :model="categoryForm">
      <el-form-item label="一级分类">
      <el-select placeholder="请选择"
                 :disabled="!isShowTable"
                 @change="list1Handle()"
                 v-model="categoryForm.category1Id">
        <el-option :label="c1.categoryName"
                   :value="c1.id"
                   v-for="(c1, index) in list1"
                   :key="c1.id"
        ></el-option>
      </el-select>
    </el-form-item>

      <el-form-item label="二级分类">
        <el-select placeholder="请选择"
                   :disabled="!isShowTable"
                   @change="list2Handle()"
                   v-model="categoryForm.category2Id">
          <el-option :label="c2.categoryName"
                     :value="c2.id"
                     v-for="(c2, index) in list2"
                     :key="c2.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="三级分类">
        <el-select placeholder="请选择"
                   :disabled="!isShowTable"
                   @change="list3Handle"
                   v-model="categoryForm.category3Id">
          <el-option :label="list3 ? c3.categoryName : ''"
                     :value="c3.id"
                     v-for="(c3, index) in list3"
                     :key="c3.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="list3Handle">查询</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
export default {
  name: "CategorySelect",
  data() {
    return {
      list1: [],
      list2: [],
      list3: [],
      categoryForm: {
        category1Id: "",
        category2Id: "",
        category3Id: "",
      }
    }
  },
  props: ['isShowTable'],
  mounted() {
    this.getCategoryInfo()
  },
  methods: {
    async getCategoryInfo() {
      let result = await this.$API.attr.reqCategoryInfo(-1)
      if (result.code === 200) {
        this.list1 = result.data
      }
    },
    async list1Handle() {
      this.categoryForm.category2Id = ''
      this.categoryForm.category3Id = ''
      const {category1Id} = this.categoryForm
      let result = await this.$API.attr.reqCategoryInfo(category1Id)
      if (result.code === 200) {
        this.list2 = result.data
      }
      this.$emit('getCategoryId', '', 1)
    },
    async list2Handle() {
      this.categoryForm.category3Id = ''
      const {category2Id} = this.categoryForm
      let result = await this.$API.attr.reqCategoryInfo(category2Id)
      if (result.code === 200) {
        this.list3 = result.data
      }
      this.$emit('getCategoryId', '', 2)
    },
    list3Handle() {
      this.$emit('getCategoryId', this.categoryForm.category3Id, 3)
    }
  }
}
</script>

<style scoped>

</style>
