<template>
	<a-config-provider :locale="locale">
    
		<router-view></router-view><!-- 路由视图，动态加载路由对应界面 -->
	</a-config-provider>
</template>


<script >
import zhCN from "ant-design-vue/es/locale/zh_CN";
import moment from "moment";
import "moment/dist/locale/zh-cn";
import { defineComponent, ref, watch } from "vue";
moment.locale("cn");
export default defineComponent({
  setup() {
    // 中文化
    const locale = zhCN.locale;
    watch(locale, (val) => {
      moment.locale(val);
    });

    return {
      locale,
      moment,
      zhCN,
    };
  },
});
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

@font-face {
	font-family: CommercialScript Bt;
	src: url('/font/CommercialScript_Bt.ttf');
}


</style>
