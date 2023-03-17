import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from "./plugins/vuetify"
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import firebase from "firebase/compat";

Vue.config.productionTip = false


const firebaseConfig = {
  apiKey: "AIzaSyDgIzIspYlgMHNyR2lw5BxyDIdaiWH9OsY",
  authDomain: "stock-management-de0b8.firebaseapp.com",
  projectId: "stock-management-de0b8",
  storageBucket: "stock-management-de0b8.appspot.com",
  messagingSenderId: "160197640355",
  appId: "1:160197640355:web:b3899ed71484df8c43bf16",
  measurementId: "G-2METCQHN4L"
};

firebase.initializeApp(firebaseConfig)

new Vue({
  router,
  store,
  vuetify,
  render: function (h) { return h(App) },
}).$mount('#app')
