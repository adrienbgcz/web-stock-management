<template>
  <div class="home">

    <div v-if='productsList.length !== 0' v-for="product in productsList" :key="product.id" class="cardContainer">
      <router-link :to="`/product-details/${product.id}`">
        <ProductCard :product-name="product.name" :price="product.price" :stock="product.stock_quantity"
                     :picture="product.picture" class="mt-10"/>
      </router-link>
    </div>
    <div class="my-2">
      <PopinForm :input-labels-and-api-name="addProductLabelsAndApiName" :element-to-add-in-db="'product'"
                 :title="'Ajouter un produit'" :icon="'mdi-devices'" :confirmation-message="'Votre produit a bien été ajouté.'"/>
    </div>

  </div>
</template>

<script>
import ProductCard from "@/components/ProductCard"
import PopinForm from "@/components/PopinForm";

export default {
  name: 'Home',
  components: {
    PopinForm,
    ProductCard
  },
  data() {
    return {
      products: [],
      picture: {label: "Ajouter une image", apiName: "picture", type: "picture"},
      productName: {
        label: "Nom du produit",
        apiName: "name",
        type: "lengthLettersNumbers",
        errorMessage: "Ce champ doit être renseigné et contenir entre 2 et 20 characters et uniquement des chiffres et des lettres."
      },
      serialNumber: {
        label: "Numéro de série",
        apiName: "serial_number",
        type: "lengthLettersNumbers",
        errorMessage: "Ce champ doit être renseigné et contenir entre 2 et 20 characters et uniquement des chiffres et des lettres."
      },
      price: {
        label: "Prix",
        apiName: "price",
        type: "number",
        errorMessage: "Ce champ doit être renseigné et ne contenir que des chiffres"
      },
      stock: {
        label: "Stock",
        apiName: "stock_quantity",
        type: "number",
        errorMessage: "Ce champ doit être renseigné et ne contenir que des chiffres"
      },
    }
  },
  computed: {
    productsList() {
      return this.products
    },
    addProductLabelsAndApiName() {
      return [this.picture, this.productName, this.serialNumber, this.price, this.stock]
    }
  },
  methods: {},
  async mounted() {
    const {data} = await this.$store.state.axiosBaseUrl.get("/devices")
    this.products = data

  }
}
</script>
