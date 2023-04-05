import Vue from 'vue'
import VueRouter from 'vue-router'
import Connection from "@/views/Connection";


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Connection',
    component: Connection
  },
  {
    path: '/registration',
    name: 'Registration ',
    component: function () {
      return import('../views/Registration.vue')
    }
  },
  {
    path: '/products',
    name: 'Products',
    component: function () {
      return import('../views/Products.vue')
    }
  },
  {
    path: '/customers',
    name: 'Customers',
    component: function () {
      return import('../views/Customers.vue')
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
  },
  {
    path: '/customer-details/:id',
    name: 'CustomerDetails',
    component: function () {
      return import('../views/CustomerDetails.vue')
    }
  },
  {
    path: '/customer-details/:customerId/bill-details/:billId',
    name: 'BillPdf',
    component: function () {
      return import('../components/BillPdf.vue')
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
