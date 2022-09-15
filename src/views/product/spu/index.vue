<template>
  <div>
    <el-card style="margin-bottom: 20px">
      <CategorySelect :isShowTable="isShowTable" @getCategoryId="getCategoryId"/>
    </el-card>
    <el-card style="margin-top: 20px">
      <div v-show="scene === 1">
        <el-button style="margin-bottom: 10px" type="primary" :disabled="!categoryId">
          <i class="el-icon-plus"></i>
          添加Spu
        </el-button>

        <el-table
          :data="spuList"
          border
          style="width: 100%">
          <el-table-column
            type="index"
            label="序号"
            width="180">
          </el-table-column>
          <el-table-column
            prop="spuName"
            label="Spu名称"
            width="360">
          </el-table-column>
          <el-table-column
            prop="description"
            label="Spu描述">
          </el-table-column>
          <el-table-column
            label="操作">
          </el-table-column>
        </el-table>

        <el-pagination
          Align="center"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page"
          :page-sizes="[limit, limit * 2, limit * 3]"
          :page-size="limit"
          layout="prev, pager, next, jumper, ->, sizes, total"
          :total="total">
        </el-pagination>
      </div>
      <sku-form v-show="scene === 2"></sku-form>
      <spu-form v-show="scene === 3"></spu-form>
    </el-card>
  </div>
</template>

<script>
import skuForm from '@/views/product/spu/skuForm'
import spuForm from '@/views/product/spu/spuForm'
export default {
  name: "spu",
  components: {
    skuForm,
    spuForm
  },
  data() {
    return {
      // 控制三级联动的显示
      isShowTable: true,

      // 页面大小
      limit: 5,
      // 当前页数
      page: 1,
      categoryId: '',
      // 总数据量
      total: 1,
      // 总页数
      pages: 1,
      // 收集获取的spu信息
      spuList: [],

      scene: 1
    }
  },
  methods: {
    // 自定义事件回调
    getCategoryId(categoryId, level) {
      this.categoryId = categoryId
      // 如果是第三级id才查询spu
      if (categoryId) {
        this.getSpuList()
      } else {
        // 三级分类变化时清除上一次的查询
        this.spuList = []
        this.total = 1
        this.page = 1
        this.pages = 1
      }
    },
    // 获取spu信息
    async getSpuList(page = 1) {
      this.page = page
      const {limit, categoryId} = this
      let res = await this.$API.spu.reqSpuInfo(page, limit, categoryId)
      if (res.code === 200) {
        this.spuList = res.data.list
        this.total = res.data.total
        this.pages = res.data.pages
      }
    },
    // 分页器页码改变回调
    handleCurrentChange(page) {
      this.page = page
      this.getSpuList(page)
    },
    // 分页器尺寸改变回调
    handleSizeChange(size) {
      this.limit = size
      this.getSpuList()
    }
  }
}
</script>

<style scoped>

</style>
