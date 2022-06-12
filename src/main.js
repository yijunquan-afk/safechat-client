import { createApp } from 'vue'
import App from './App.vue'
import router from './common/router'
import constants from '@/common/constants'

// 导入font-awesome组件
import 'font-awesome/css/font-awesome.min.css'

// 导入已封装好的服务端访问对象
import request from "@/common/request"

//导入防抖函数
import debounce from "@/common/debounce"
// 导入快捷提示对象
import tip from "@/common/tip"

// 数据字典初始化
import "@/common/ddo"

// 加载提示组件初始化
import "@/common/loading/loading"

// 导入加载提示
import loading from "@/common/loading"

// 导入阿里云And Design组件
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';

//导入moment
import moment from 'moment'

createApp(App)
    .use(router)
    .use(request)
    .use(tip)
    .use(loading)
    .use(Antd)
    .use(loading)
    .use(moment)
    .mount('#app')
