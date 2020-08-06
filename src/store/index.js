import Vue from 'vue'
import Vuex from 'vuex'

import mutations  from './mutations'
import actions from './actions'
import getters from './getters'

Vue.use(Vuex)

const state = {
  cartlist: []
}

const store = new Vuex.store({
  state,
  mutations,
  actions,
  getters
})

export default store