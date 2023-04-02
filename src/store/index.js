import Vue from 'vue'
import Vuex from 'vuex'
import Axios from "axios";
import Constants from "@/constants";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    axiosBaseUrl: Axios.create({baseURL: Constants.BASE_URL}),
    products : [],
    customers: [],
  },
  mutations: {
    setProducts(state, products) {
      state.products = products
    },
    setCustomers(state, customers) {
      state.customers = customers
    }
  },
  actions: {
  },
  modules: {
  }
})
