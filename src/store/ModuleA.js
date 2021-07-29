const module = {
    state: {
        Fan_A: {id: 1, name: '凡三岁', rank: 'p6', online: true},
        Jack_A: {id: 2, name: 'Jack Ma', rank: 'p10', online: true},
        Tony_A: {id: 3, name: 'Tony Ma', rank: 'p10', online: true},
        userCount_A: 3
    },
    mutations: {
        SET_RANK_A: (state, payload) => state.Fan_A.rank = payload,
        SET_ONLINE_A: (state, payload) => state.Fan_A.online = false
    },
    actions: {
        //injectee 相当于在Vue组件用使用this.$store
        setRank_A: (injectee, payload) => injectee.commit('SET_RANK_A',payload)
    },
    getters: {
        simpleHandle_A: (state) => {
            let rankP = Number(state.Fan_A.rank.replace('p', ''))
            let salary = Math.pow(2, rankP - 5) * 20
            return salary + 'w'
        }
    }
}

export default module