import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    map: null,
    tileLayerRetval: null,
    vectorTileInstance: null,
    initialTileStyle : {
      color: "green",
      fill: true,
      fillColor: "green"
    }
  },
  mutations: {
    setMap (state, map) {
      state.map = map
    },
    addLayer (state, L) {
      L.addTo(state.map)
    },
    setVectorTileInstance(state, vectorTileInstance){
      state.vectorTileInstance = vectorTileInstance
    },
  },
  actions: {
  }
})
