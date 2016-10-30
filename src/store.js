import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
	strict: true,
	state: { dates: [] },
	mutations: {
		toggleDate(state, date) {
			const index = state.dates.indexOf(date)
			index < 0 && state.dates.push(date)
			index > -1 && state.dates.splice(index, 1)
			state.dates.sort()
		}
	}
})
