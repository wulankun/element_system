<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片试图区 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog"
            >添加分配</el-button
          >
        </el-col>
      </el-row>
      <!-- 表格 -->
      <zk-table
        class="treeTable"
        :data="catelist"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        :show-row-hover="false"
      >
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope" :index="scope">
          <i
            class="el-icon-success"
            style="color: lightgreen"
            v-if="scope.row.cat_deleted == false"
          ></i>
          <i class="el-icon-error" style="color: lightgreen" v-else></i>
        </template>
        <!-- 排序 -->
        <template slot="oder" slot-scope="scope" :index="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0"> 一级</el-tag>
          <el-tag
            type="success"
            size="mini"
            v-else-if="scope.row.cat_level === 1"
          >
            二级</el-tag
          >
          <el-tag type="warning" size="mini" v-else> 三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt" slot-scope="scope" :index="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini"
            >编辑</el-button
          >
          <el-button type="danger" icon="el-icon-delete" size="mini"
            >删除</el-button
          >
        </template>
      </zk-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handelSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addCateDialogClosed"
    >
      <!-- 添加分类的表单 -->
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>

        <el-form-item label="父级分类">
          <!-- 多级选择器 -->
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"           
            expand-trigger="hover"
            :props=" cascaderProps "
            @change="parentCtechanged"
            change-on-select
            clearable

          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { catelist1, catelist2,fenlei } from "../../network/category";
export default {
  name: "Categories",
  created() {
    this.getCatelist();
  },
  data() {
    return {
      // 选中的父级分类的ID数组
      selectedKeys:[

      ],
      // 指定级联选择器的配置对象
      cascaderProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      //父级分类的列表
      parentCateList: [],
      // 添加分类表单验证规则对象
      addCateFormRules: {
        cat_name: [
          {
            required: true,
            message: "请输入分类名称",
            trigger: "blur",
          },
        ],
      },
      // 添加分类的表单数据
      addCateForm: {
        cat_name:'',
        cat_pid: 0,
        cat_level: 0,
      },
      // 控制添加分类的对话框的显示与隐藏
      addCateDialogVisible: false,
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
        },
        {
          // 插入作用于插槽
          label: "是否有效",
          type: "template",
          // slot的name 也就是（具名插槽）
          template: "isok",
        },
        {
          // 插入作用于插槽
          label: "排序",
          type: "template",
          // slot的name 也就是（具名插槽）
          template: "oder",
        },
        {
          // 插入作用于插槽
          label: "操作",
          type: "template",
          // slot的name 也就是（具名插槽）
          template: "opt",
        },
      ],
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      catelist: [],
      total: 0,
    };
  },
  methods: {
    // 监听对话框的变比
    addCateDialogClosed(){
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys=[]
      this.addCateForm.cat_level=0
      this.addCateForm.cat_pid=0
    },
    addCate(){
      // console.log(this.addCateForm);
      this.$refs.addCateFormRef.validate(valid=>{
        if(!valid) return
        fenlei(this.addCateForm.cat_name,this.addCateForm.cat_pid,this.addCateForm.cat_level).then(res=>{
          // console.log(res);
          if(res.meta.status!==201){ return this.$message.error('添加失败')}
          this.$message.success('添加成功')
          this.getCatelist()
          this.addCateDialogVisible=false
        })
      })
    },
    parentCtechanged(){
      console.log(this.selectedKeys);
      // 如果selectedKeys的length大于0，证明选中父级分类
      if(this.selectedKeys.length>0){
      this.addCateForm.cat_pid=  this.selectedKeys[this.selectedKeys.length-1]
      this.addCateForm.cat_level=this.selectedKeys.length
      return
      }else{
         this.addCateForm.cat_pid=  0
      this.addCateForm.cat_level=0
      }

    },
    // 获取父级分类的数据
    getParentCateList() {
      catelist2().then((res) => {
        // console.log(res);
        this.parentCateList = res.data;
      });
    },
    showAddCateDialog() {
      this.getParentCateList();
      this.addCateDialogVisible = true;
    },
    // 监听pagesize改变
    handelSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getCatelist();
    },
    // 监听pagenum改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getCatelist();
    },
    getCatelist() {
      catelist1(
        this.queryInfo.type,
        this.queryInfo.pagenum,
        this.queryInfo.pagesize
      ).then((res) => {
        // console.log(res);
        if (res.meta.status !== 200) {
          return this.$message.error("获取失败");
        }
        this.$message.success("获取成功");
        this.catelist = res.data.result;
        this.total = res.data.total;
      });
    },
  },
};
</script>

<style lang="less" scoped>
.treeTable {
  margin-top: 15px;
}
.el-cascader{
  width: 100%;
}
</style>