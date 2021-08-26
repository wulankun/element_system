import Vue from 'vue'
import App from './App.vue'
import router from './router'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import ZkTable from 'vue-table-with-tree-grid'
//导入全局样式表
import './assets/css/global.css'
import './assets/icon/iconfont.css'

import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'






import {MessageBox} from 'element-ui'
Vue.prototype.$confirm=MessageBox.confirm
Vue.use(ElementUI);
Vue.use(ZkTable)
Vue.use(VueQuillEditor)


Vue.filter('dateFormat',function(originVal){
 const dt=  new Date(originVal)

 const y=dt.getFullYear()
 const m=(dt.getMonth()+1+'').padStart(2,'0')
 const d=(dt.getDate()+'').padStart(2,'0')
 const hh=(dt.getHours()+'').padStart(2,'')
 const mm=(dt.getMinutes()+'').padStart(2,'')
 const ss=(dt.getSeconds()+'').padStart(2,'0')

 return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
