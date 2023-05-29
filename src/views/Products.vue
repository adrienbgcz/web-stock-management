<template>
  <div class="home">
    <div class="text-center" v-if="isLoadingComputed">
      <v-progress-circular
         indeterminate
         color="#6750A4"
         width="7"
         size="70"
      />
    </div>
    <div  v-else v-for="product in productsList" :key="product.id" class="cardContainer">
      <router-link :to="`/product-details/${product.id}`">
        <ProductCard :product-name="product.name" :price="product.price" :stock="product.stock_quantity"
                     :picture="product.picture" class="mt-10"/>
      </router-link>
    </div>


    <div class="my-2">
      <PopinForm :input-labels-and-api-name="addProductLabelsAndApiName" :element-to-add-in-db="'product'"
                 :title="'Ajouter un produit'" :icon="'mdi-devices'" :confirmation-message="'Votre produit a bien été ajouté.'"
                 :error-message="'Une erreur est suvenue pendant l\'ajout du produit'" />
    </div>

  </div>
</template>

<script>
import ProductCard from "@/components/ProductCard"
import PopinForm from "@/components/PopinForm";
import Constants from "@/constants";

export default {
  name: 'Products',
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
        type: "double",
        errorMessage: "Ce champ doit être renseigné et ne contenir que des chiffres. Utilisez un point (et pas une virgule) pour les décimaux (ex: 10.99)"
      },
      stock: {
        label: "Stock",
        apiName: "stock_quantity",
        type: "integer",
        errorMessage: "Ce champ doit être renseigné et ne contenir que des chiffres"
      },
      isLoading: false
    }
  },
  computed: {
    productsList() {
      return this.products
    },
    addProductLabelsAndApiName() {
      return [this.picture, this.productName, this.serialNumber, this.price, this.stock]
    },
    isLoadingComputed() {
      return this.isLoading
    }
  },
  methods: {},
  async mounted() {
    this.isLoading = true
    if(this.$store.state.products.length > 0) {
      this.products = this.$store.state.products
    } else {
      let data;
      try {
          data = await this.$store.state.axiosBaseUrl.get(`/devices/user/${localStorage.userId}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem("token")
          }
        })
      } catch(e) {
        console.error(e)
        if(e.response.status === 401) await this.$router.replace({path: '/'})
      }

      this.products = data.data
      this.$store.commit('setProducts', this.products)
    }
    this.isLoading = false
  }
}
</script>
