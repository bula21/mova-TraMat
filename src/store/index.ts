import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    userStatus: "",
    searchOption: "undefined",
  },
  mutations: {
    loginSuccess(state) {
      state.userStatus = "LOGGEDIN";
    },
    logout(state) {
      state.userStatus = "LOGOUT";
      sessionStorage.clear();
      localStorage.setItem("LOGOUT", state.userStatus + "." + Date.now());
      setTimeout(() => {
        localStorage.clear();
      }, 3000);
    },
    authRequested(state) {
      state.userStatus = "REQUEST";
    },
    loginFailed(state) {
      state.userStatus = "ERROR";
    },
    changeSearchOption(state, payload) {
      state.searchOption = payload;
    },
    changeSearchToEmpty(state) {
      state.searchOption = "undefined";
    },
  },
  actions: {
  },
  modules: {
  },
  getters: {
  }
});
