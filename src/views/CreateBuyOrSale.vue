<template>
  <div class="about">
    <h1>Editer une facture</h1>

    <v-autocomplete
        v-model="selectedCustomer"
        :items="customers"
        item-text="company_name"
        item-value="id"
        dense
        filled
        label="Choose a customer"
        @change="logSelectedCustomer"
    ></v-autocomplete>

    <v-row>
      <v-col :cols="!$vuetify.breakpoint.xs ? 10 : 8">
        <v-autocomplete
            v-model="selectedProduct"
            :items="products"
            item-text="name"
            item-value="id"
            dense
            filled
            label="Choose a product to add"
            @change="logSelectedProduct"
        ></v-autocomplete>
      </v-col>
      <v-col :cols="!$vuetify.breakpoint.xs ? 2 : 1">
        <v-btn
            class="mx-2"
            fab
            dark
            color="#6750A4"
        >
          <v-icon dark>
            mdi-plus
          </v-icon>
        </v-btn>
      </v-col>
    </v-row>

    <v-simple-table>
      <template v-slot:default>
        <thead>
        <tr>
          <th class="text-left productColumn">
            Produit
          </th>
          <th class="text-left">
            Quantité
          </th>
          <th class="text-left">
            Prix
          </th>
        </tr>
        </thead>
        <tbody>
        <tr>
<!--            v-for="item in desserts"
            :key="item.name"-->

<!--          <td>{{ item.name }}</td>
          <td>{{ item.calories }}</td>-->
        </tr>
        </tbody>
      </template>
    </v-simple-table>

  </div>
</template>

<script>
export default {
  name: 'CreateBuyOrSale',
  comments: {},
  data() {
    return {
      products: [],
      productsNames: [],
      customers: [],
      customersNames: [],
      selectedProduct: null,
      selectedCustomer: null
    }
  },
  methods: {
    logSelectedProduct() {
      console.log(this.selectedProduct)
    },
    logSelectedCustomer() {
      console.log(this.selectedCustomer)
    }

  },
  async mounted() {
    if (this.$store.state.products.length > 0) {
      this.products = this.$store.state.products
    } else {
      const {data} = await this.$store.state.axiosBaseUrl.get("/devices")
      this.products = data
      this.$store.commit('setProducts', data)
    }
    /*this.products.forEach(product => this.productsNames.push(product.name))
    console.log(this.$store.state.products)*/

    if (this.$store.state.customers.length > 0) {
      this.customers = this.$store.state.customers
    } else {
      const {data} = await this.$store.state.axiosBaseUrl.get("/customers")
      this.customers = data
      this.$store.commit('setCustomers', data)
    }

    /*this.customers.forEach(customer => this.customersNames.push(customer.company_name))
    console.log(this.$store.state.customers)*/

  }

}

</script>

<style scoped>
.productColumn {
  width: 60%

}

</style>