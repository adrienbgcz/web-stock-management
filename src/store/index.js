import Vue from 'vue'
import Vuex from 'vuex'
import Axios from "axios";
import Constants from "@/constants";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    axiosBaseUrl: Axios.create({baseURL: Constants.BASE_URL}),
    userPseudo: "",
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
    setUserPseudo(state, userPseudo) {
      state.userPseudo = userPseudo
    },
    addCustomer(state, customer) {
      state.customers.push(customer)
    },
    addProduct(state, product) {
      state.products.push(product)
    },
    deleteUserPseudo(state) {
      state.userPseudo = ""
      state.products = []
      state.customers = []
    },
    resetProductsAndCustomers(state) {
      state.products = []
      state.customers = []
    }
  },
  actions: {
  },
  modules: {
  },
  plugins: [createPersistedState({
    paths: ["products", "customers", "userPseudo"]
  })]
})
