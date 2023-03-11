<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
  </div>
</template>

<script>
import Products from '../views/Products'
import Axios from 'axios'
import Constants from '../constants'

export default {
  name: 'Home',
  components: {
    Products
  },
  methods: {


  },
  async mounted() {
    console.log('ici')
    const productInstance = Axios.create({baseURL: Constants.BASE_URL})
    const {data} = await productInstance.get("/devices")
    console.log(data)
  }
}
</script>
