<template>
  <div>
  <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片试图区 -->
    <el-card>
     
       
    <div
    id="main" style="width: 1200px; height: 400px; " >
    </div>

    </el-card>
  </div>
</template>

<script>
import {reports1} from '../../network/reports'
// import echarts from 'echarts'
import * as echarts from 'echarts';
import _ from 'lodash'
export default {
    name:'Reports',
    data(){
        return{
            options: {
          title: {
            text: '用户来源'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#E9EEF3'
              }
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              boundaryGap: false
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ]
        }
        }
    },
    mounted(){
        var myChart = echarts.init(document.getElementById('main'));
        reports1().then(res=>{
            // console.log(res);
            // 数据合并
        const result=    _.merge(res.data,this.options)
            myChart.setOption(result);
        })
        
    },
    
}
</script>

<style lang="less" scoped>

</style>