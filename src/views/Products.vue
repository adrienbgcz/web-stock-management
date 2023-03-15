<template>
  <div class="home">

      <div v-if='productsList.length !== 0' v-for="product in productsList" :key="product.id" class="cardContainer">
        <router-link :to="`/product-details/${product.id}`">
          <ProductCard :product-name="product.name" :price="product.price" :stock="product.stock_quantity"
                       :picture="product.picture" class="mt-10"/>
        </router-link>
      </div>
      <div class="my-2">
        <PopinForm :input-labels-and-api-name="addProductLabelsAndApiName"/>
      </div>

  </div>
</template>

<script>
import Products from '../views/Products'
import ProductCard from "@/components/ProductCard"
import FloatingButton from "@/components/FloatingButton"
import PopinForm from "@/components/PopinForm";

export default {
  name: 'Home',
  components: {
    PopinForm,
    FloatingButton,
    ProductCard,
    Products
  },
  data() {
    return {
      products: [],
      productName: {label: "Nom du produit", apiName: "name", type: "string"},
      serialNumber: {label: "Numéro de série", apiName: "serial_number", type: "string"},
      price: {label: "Prix", apiName: "price", type: "number"},
      stock: {label: "Stock", apiName: "stock_quantity", type: "number"}
    }
  },
  computed: {
    productsList() {
      return this.products
    },
    addProductLabelsAndApiName() {
      return [this.productName, this.serialNumber, this.price, this.stock]
    }
  },
  methods: {
  },
  async mounted() {
    const {data} = await this.$store.state.axiosBaseUrl.get("/devices")
    this.products = data

  }
}
</script>
