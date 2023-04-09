import Vue from 'vue'
import Vuex from 'vuex'
import Axios from "axios";
import Constants from "@/constants";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    axiosBaseUrl: Axios.create({baseURL: Constants.BASE_URL}),
    welcomeMessage: false,
    products : [],
    customers: [],
  },
  mutations: {
    setProducts(state, products) {
      state.products = products
    },
    setCustomers(state, customers) {
      state.customers = customers
    },
    setWelcomeMessage(state, isDisplay) {
      state.welcomeMessage = isDisplay
    }

  },
  actions: {
  },
  modules: {
  },
  plugins: [createPersistedState({
    paths: [/*"products", "customers"*/]
  })]
})
