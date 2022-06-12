/**
 * 数据字典
 */

import { reactive } from 'vue'

const ddo = {

	refresh: true,//是否刷新

	text(mark, code) {
		const option = this[mark].find(item => item.value === code);
		return option ? option.label : '';
	},
	homeConatiner:null,
	gotoHomeTop(){
		if(this.homeConatiner){
			this.homeConatiner.scrollTo(0,0);
		}
	},
	// 当前用户信息
	currentUser: {},

	//性别
	sex: [{
		value: 1,
		label: '男'
	}, {
		value: 2,
		label: '女'
	}],

	currentInformation: {
		currentIndex:1,
		list:[]
	},


	getTitleString(codeString, delimiter) {
		if (codeString && (codeString instanceof String || typeof codeString === 'string')) {
			const arr = codeString.split(delimiter || ',');
			return this.title.filter(item => arr.some(code => Number(code) == item.value)).map(item => item.label).join(delimiter || ',');
		}
		return '';
	},


	//初始化字典数据，forced表示是否强制从服务器获取最新数据
	init(forced) {

		if (this.refresh || forced) {

			//在这里可以加入初始化逻辑

			this.refresh = false;
		}

	}

};

ddo.init();

export default reactive(ddo);
