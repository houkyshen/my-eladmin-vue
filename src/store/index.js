import Vue from 'vue'
import Vuex from 'vuex'
import module from "@/store/ModuleA";
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    Fan: {id: 1, name: '凡三岁', rank: 'p6', online: true},
    Jack: {id: 2, name: 'Jack Ma', rank: 'p10', online: true},
    Tony: {id: 3, name: 'Tony Ma', rank: 'p10', online: true},
    userCount: 3
  },
  mutations: {
    SET_RANK: (state, payload) => state.Fan.rank = payload,
    SET_ONLINE: (state, payload) => state.Fan.online = false
  },
  actions: {
    //injectee 相当于在Vue组件用使用this.$store
    setRank: (injectee, payload) => injectee.commit('SET_RANK',payload)
  },
  getters: {
    simpleHandle: (state) => {
      let rankP = Number(state.Fan.rank.replace('p', ''))
      let salary = Math.pow(2, rankP - 5) * 20
      return salary + 'w'
    }
  },
  modules: {
    module
  }
})
