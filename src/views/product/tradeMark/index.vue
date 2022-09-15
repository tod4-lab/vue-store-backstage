<template>
  <div>
    <el-button type="primary" icon="el-icon-plus"
               @click="showDialog">添加
    </el-button>
    <el-table style="margin-top: 10px" :data="list" border>
      <el-table-column
        type="index"
        align="center"
        prop="prop"
        label="序号"
        width="80"
      ></el-table-column>

      <el-table-column
        align="center"
        prop="tmname"
        label="品牌名称"
        width="width"
      ></el-table-column>

      <el-table-column
        align="center"
        prop="logourl"
        label="品牌Logo"
        width="width"
      >
        <template slot-scope="{row, $index}">
          <img :src="row.logourl"
               style="width: 60px;height:50px" alt="logo"/>
        </template>

      </el-table-column>

      <el-table-column
        align="center"
        prop="prop"
        label="操作"
        width="width"
      >

        <template slot-scope="{row, $index}">
          <el-button @click="updateTradeMark(row)" type="warning">修改</el-button>
          <el-button @click="deleteTradeMark(row)" type="danger">删除</el-button>
        </template>

      </el-table-column>

    </el-table>
    <!--  分页器  -->
    <el-pagination
      style="margin-top:20px;textAlign:center"
      :total="total"
      :current-page="page"
      :page-size="limit"
      :page-count="pages"
      :page-sizes="[5, 10, 15]"
      layout="prev, pager, next, jumper, ->, sizes, total"
      @current-change="pageChangeHandle"
      @size-change="sizeChangeHandle"
    ></el-pagination>

    <el-dialog :title="tmForm.id ? '修改品牌':'添加品牌'" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="ruleForm" :model="tmForm">
        <el-form-item prop="tmname" label="品牌名称" label-width="100px">
          <el-input autocomplete="off" v-model="tmForm.tmname" style="width: 400px"></el-input>
        </el-form-item>

        <el-form-item prop="logourl" label="品牌LOGO" label-width="100px">
          <el-upload
            class="upload-demo"
            action="/api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="tmForm.logourl" :src="tmForm.logourl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过10MB</div>
          </el-upload>

        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="hiddenDialogForm">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTradeMark">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: "index",
  data() {
    var checkTmname = (rule, value, callback) => {
      if(value.length >= 2 && value.length <= 5) {
        callback()
      } else {
        callback(new Error('品牌名称应在2-5位字符'))
      }
    }
    return {
      page: 1,
      limit: 5,

      list: [],
      total: 0,
      pages: 1,
      dialogFormVisible: false,

      tmForm: {
        tmname: '',
        logourl: ''
      },
      // 表单验证规则
      rules: {
        tmname: [
          {required: true, message: '请输入品牌名称', trigger: 'blur'},
          // {min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur'}
          {validator: checkTmname, trigger: 'blur'}
        ],
        logourl: [
          {required: true, message: '请上传品牌LOGO'}
        ]
      }
    }
  },
  mounted() {
    this.getPageList()
  },
  methods: {
    async getPageList(newPage = 1) {
      this.page = newPage
      const {page, limit} = this
      let result = await this.$API.tradeMark.reqTradeMarkList(page, limit)
      this.list = result.data.list
      this.total = result.data.total
      this.pages = result.data.pages
    },
    pageChangeHandle(page) {
      this.getPageList(page)
    },
    sizeChangeHandle(limit) {
      this.limit = limit
      this.getPageList()
    },
    showDialog() {
      this.tmForm.tmname = ''
      this.tmForm.logourl = ''
      this.dialogFormVisible = true
    },
    hiddenDialogForm() {
      this.dialogFormVisible = false
      this.tmForm = {
        tmname: '',
        logourl: ''
      }
    },
    // 进行品牌LOGO上传
    handleAvatarSuccess(res, file) {
      this.tmForm.logourl = res.data;
      this.$message({
        message: '品牌LOGO上传成功',
        type: 'success'
      });
    },
    beforeAvatarUpload(file) {
      // const isJPG = file.type === 'image/jpeg';
      // const isLt2M = file.size / 1024 / 1024 < 10;
      //
      // if (!isJPG) {
      //   this.$message.error('上传头像图片只能是 JPG 格式!');
      // }
      // if (!isLt2M) {
      //   this.$message.error('上传头像图片大小不能超过 10MB!');
      // }
      // return isJPG && isLt2M;
    },
    addOrUpdateTradeMark() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          await this.$API.tradeMark.reqAddOrUpdateTradeMark(this.tmForm)
          this.$message({
            message: this.tmForm.id ? `品牌 ${this.tmForm.tmname} 修改成功` : `品牌 ${this.tmForm.tmname} 添加成功`,
            type: 'success'
          })
          this.hiddenDialogForm()
          await this.getPageList(this.page)
        } else {
          return false;
        }
      });
    },
    // 品牌删除
    async deleteTradeMark(row) {
      let id = row.id
      let result = await this.$API.tradeMark.reqDeleteTradeMark(id)
      if (result.code === 200) {
        this.$message({
          message: `品牌 ${row.tmname} 删除成功`,
          type: 'success'
        })
      }
      await this.getPageList()
    },
    // 品牌修改
    updateTradeMark(row) {
      // 使用浅拷贝，只改变tmForm的数值而不改变tmForm从list拷贝的值
      this.tmForm = {...row}
      this.dialogFormVisible = true
    }
  }
};
</script>

<style lang="css">
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
