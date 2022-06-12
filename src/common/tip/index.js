import { createApp } from 'vue';
import TipApp from './TipApp.vue'

const tipApp = createApp(TipApp);

const tip_ = tipApp.mount(document.createElement('div'));
document.body.appendChild(tip_.$el);

export const tip = tip_;

export default {
	install(app) {
		app.config.globalProperties.$tip = tip_;
	}
};
