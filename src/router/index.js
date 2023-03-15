import Vue from 'vue'
import VueRouter from 'vue-router'
import Products from '../views/Products.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Products',
    component: Products
  },
  {
    path: '/contacts',
    name: 'Contacts',
    component: function () {
      return import('../views/Contacts.vue')
    }
  },
  {
    path: '/buy-or-sale',
    name: 'CreateBuyOrSale',
    component: function () {
      return import('../views/CreateBuyOrSale.vue')
    }
  },
  {
    path: '/product-details/:id',
    name: 'ProductDetails',
    component: function () {
      return import('../views/ProductDetails.vue')
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
