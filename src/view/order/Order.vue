<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片试图区 -->
    <el-card>
      <el-row>
        <el-col>
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 订单列表数据 -->
      <el-table :data="orderlist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款" prop="pay_status">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pay_status === '1'"
              >已付款</el-tag
            >
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send">
          <template slot-scope="scope">
            {{ scope.row.is_send }}
          </template>
        </el-table-column>
        <el-table-column label="下单时间" prop="create_time">
          <template slot-scope="scope">
            {{ scope.row.create_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template>
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="showBox"
            ></el-button>
            <el-button
              type="success"
              size="mini"
              icon="el-icon-location"
              @click="showProgressBox"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 修改地址的对话框 -->
    <el-dialog title="修改地址" :visible.sync="addressVisible" width="30%">
      <el-form
        :model="addressForm"
        :rules="addressFormRules"
        ref="addressFormRef"
        label-width="100px"
      >
        <!-- cityData  addressForm.address1 这里是写在级联选择器里面options和v-model里的 -->
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader :options="cityData" v-model="addressForm.address1">
          </el-cascader>
        </el-form-item>
        <el-form-item label="省市区/县" prop="address2">
          <el-input v-model="addressForm.adddress1"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressVisible = false">取 消</el-button>
        <el-button type="primary" @click="addressVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 展示物流进度的对话框 -->
    <el-dialog title="物流进度" :visible.sync="progressisible" width="50%">

      <!-- 时间线（APIi接口获取的用这个） -->
      <!-- <el-timeline >
        <el-timeline-item
          v-for="(activity, index) in progressInfo"
          :key="index"
          :timestamp="activity.time" >      
          {{ activity.context }}
        </el-timeline-item>
      </el-timeline> -->

      <!-- 时间线 -->
       <el-timeline :reverse="reverse">
    <el-timeline-item
      v-for="(activity, index) in activities"
      :key="index"
      :timestamp="activity.timestamp">
      {{activity.content}}
    </el-timeline-item>
  </el-timeline>
      <span slot="footer" class="dialog-footer">
        <el-button @click="progressisible = false">取 消</el-button>
        <el-button type="primary" @click="progressisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { oder1, oder2 } from "../../network/order";
export default {
  name: "Order",
  created() {
    this.getOrderList();
  },
  data() {
    return {
      // 时间线
       reverse: true,
        activities: [{
          content: '快递到达北京市朝阳区',
          timestamp: '2018-04-15'
        }, {
          content: '快递到达广西南宁-分公司',
          timestamp: '2018-04-13'
        }, {
          content: '快递到达河池市-宜州区',
          timestamp: '2018-04-12'
        },
        {
          content: '快递到达太平村',
          timestamp: '2018-04-12'
        }],
        // 时间线结束标签
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      total: 0,
      orderlist: [],
      addressVisible: false,
      addressForm: {
        address1: [],
        address2: "",
      },
      addressFormRules: {
        address1: [
          {
            required: true,
            message: "请选择地区",
            trigger: "blur",
          },
        ],
        address2: [
          {
            required: true,
            message: "请选择地区",
            trigger: "blur",
          },
        ],
      },
      cityData: [],
      progressisible: false,
      progressInfo: [],
    };
  },
  methods: {
    showProgressBox() {
      // oder2().then(res=>{
      // console.log(res);
      //   if(res.meta.status!==200 ){
      //     return this.$message.error('获取失败')
      //   }
      //   this.$message.success('获取成功')
      // this.progressInfo=res.data
      // })
      this.progressisible=true
    },
    showBox() {
      this.addressVisible = true;
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getOrderList();
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getOrderList();
    },
    getOrderList() {
      oder1(this.queryInfo).then((res) => {
        // console.log(res);
        if (res.meta.status !== 200) return this.$message.error("获取失败");
        this.total = res.data.total;
        this.orderlist = res.data.goods;
      });
    },
  },
};
</script>

<style lang="less" scoped>
</style>