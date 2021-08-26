<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片试图去 -->
    <el-card>
      <el-alert
        show-icon
        title="注意:只允许设置第三级分类的相关设置!"
        :closable="false"
        type="warning"
      >
      </el-alert>
      <!-- 选择商品分类区域 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类</span>
          <!-- 选择商品分类的级联选择框 -->
          <el-cascader
            v-model="selectedCateKeys"
            :options="catelist"
            :props="cateProps"
            
            expand-trigger="hover"
            @change="handleChange"
            change-on-select
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- tab页标签 -->
      <el-tabs v-model="activeName" type="card" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many"
          ><el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addDialogVisible = true"
            >添加参数</el-button
          >
          <el-table :data="manyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循环渲染Tag标签 -->
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  @close="handleClose(i,scope.row)"
                  :key="i"
                  closable
                  >{{ item }}</el-tag
                >

                <!-- 输入文本框1 -->
                <el-input
                
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <!-- 添加的按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                 
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope" :index="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removePrams(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only"
          ><el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addDialogVisible = true"
            >添加参数</el-button
          >

          <el-table :data="onlyTabData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循环渲染Tag标签 -->
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  @close="handleClose(i,scope.row)"
                  :key="i"
                  closable
                  >{{ item }}</el-tag
                >

                <!-- 输入文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <!-- 添加的按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column
              label="属性名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope" :index="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removePrams(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          ></el-tab-pane
        >
      </el-tabs>
    </el-card>
    <!-- 添加参数的对话框 -->
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改参数对话框 -->
    <el-dialog
      :title="'修改' + titleText"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  params1,
  params2,
  queding,
  bianji,
  huoqu1,
  delete1,
  tijiaocanshu
} from "../../network/params";
export default {
  name: "Params",
  created() {
    this.getCateList();
  },
  data() {
    return {
      catelist: [],
      cateProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      //   级联选择框
      selectedCateKeys: [],
      //   被激活的页签名字
      activeName: "many",
      manyTableData: [],
      onlyTabData: [],
      addDialogVisible: false,
      addForm: {
        attr_name: "",
      },
      addFormRules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" },
        ],
      },
      //编辑的参数
      editDialogVisible: false,
      editForm: {
        attr_name: "",
      },
      editFormRules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" },
        ],
      },
     
    };
  },
  methods: {
    handleClose(i,row){
      row.attr_vals.splice(i,1)
this.saveAttrVals(row)

    },
    saveAttrVals(row){
       tijiaocanshu(this.cateId,row.attr_id,row.attr_name,row.attr_sel,row.attr_vals.join( )).then(res=>{
        // console.log(res);
        if(res.meta.status!==200) return this.$message.error('修改出错了')
        this.$message.success('修改成功了')
      })
     
    },
    showInput(row) {
      row.inputVisible = true;
      this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
    },
    handleInputConfirm(row) {
      if(row.inputValue.trim().length===0){
        row.inputValue=''
        row.inputVisible=false
        return
      }
      row.attr_vals.push(row.inputValue)
      row.inputValue=''
      row.inputVisible=false

    this.saveAttrVals(row)

    },
    // 根据ID删除对应的参数项
    async removePrams(attr_id) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmResult !== "confirm") {
        return this.$message.info("取消了操作");
      }
      delete1(this.cateId, attr_id).then((res) => {
        // console.log(res);
        if (res.meta.status !== 200) return this.$message.error("错误");
        this.$message.success("删除成功");
        this.getParamsDate();
      });
    },
    editParams() {
      this.$refs.editFormRef.validate((valid) => {
        if (!valid) return;
        huoqu1(
          this.cateId,
          this.editForm.attr_id,
          this.editForm.attr_name,
          this.activeName
        ).then((res) => {
          console.log(res);
          if (res.meta.status !== 200) return this.$message.error("更新失败");
          this.$message.success("更新成功");
          this.getParamsDate();
          this.editDialogVisible = false;
        });
      });
    },
    editDialogClosed() {
      // 重置表单的操作
      this.$refs.editFormRef.resetFields();
    },
    showEditDialog(attr_id) {
      bianji(this.cateId, attr_id, this.activeName).then((res) => {
        console.log(res);

        if (res.meta.status !== 200) {
          return this.$message.error("接收错误");
        }
        // this.addDialogVisible=false
        this.editForm = res.data;
        this.getParamsDate();
      });

      this.editDialogVisible = true;
    },
    addParams() {
      this.$refs.addFormRef.validate((valid) => {
        if (!valid) {
          return;
        }
        queding(this.cateId, this.addForm.attr_name, this.activeName).then(
          (res) => {
            // console.log(res);
            if (res.meta.status !== 201) {
              return this.$message.error("错误");
            }
            this.getParamsDate();
            this.addDialogVisible = false;
          }
        );
      });
    },
    //   监听添加对话框的关闭
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    //   获取参数的列表数据
    getParamsDate() {
      //   证明不是三级分类
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = [];
        return;
      }
      //   console.log(this.selectedCateKeys);
      params2(this.cateId, this.activeName).then((res) => {
        // console.log(res);
        if (res.meta.status !== 200) return this.$message.error("获取失败");
        res.data.forEach((item) => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
          //控制文本框的显示与隐藏
          item.inputVisible=false
          //文本框中输入的值
          item.inputValue=''
        });
        // console.log(res.data);
        // console.log(res.data);
        if (this.activeName === "many") {
          this.manyTableData = res.data;
        } else {
          this.onlyTabData = res.data;
        }
      });
    },
    //   tab页签点击事件的处理函数
    handleTabClick() {
      console.log(this.activeName);
      this.getParamsDate();
    },
    //   级联选择框选中变化,会触发这个函数
    handleChange() {
      this.getParamsDate();
    },
    getCateList() {
      params1().then((res) => {
        // console.log(res);
        if (res.meta.status !== 200) return this.$message.error("获取失败");
        this.catelist = res.data;
        
       
      });
    },
  },
  computed: {
    //   动态计算标题的文本
    titleText() {
      if (this.activeName === "many") {
        return "动态参数";
      } else {
        return "静态属性";
      }
    },
    //   当前选中的三级分类的ID
    cateId() {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2];
      }
      return null;
    },
    isBtnDisabled() {
      if (this.selectedCateKeys.length !== 3) {
        return true;
      }
      return false;
    },
  },
};
</script>

<style lang="less" scoped>
.cat_opt {
  margin: 15px 0;
}

.el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>