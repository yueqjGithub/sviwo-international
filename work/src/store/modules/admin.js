const state = {
  preImg: false, // 是否显示放大图片板
  imgSrc: ''
}

const actions = {
}

const mutations = {
  seePic: function (state, src) {
    state.preImg = true
    state.imgSrc = src
  },
  nSeePic: function (state) {
    state.preImg = false
  }
}

const getters = {
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
