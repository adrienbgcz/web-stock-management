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
        @input="logSelectedCustomer"
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
            :error-messages="errorMessageProduct"
            return-object
        ></v-autocomplete>
      </v-col>
      <v-col :cols="!$vuetify.breakpoint.xs ? 2 : 1">
        <v-btn
            class="mx-2"
            fab
            dark
            color="#6750A4"
            @click="addProduct"
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
        <tr
            v-for="(product, index) in productsToDisplayInBillComputed"
            :key="product.id">

          <td>{{ product.name }}</td>
          <td><v-text-field v-model="product.quantity" @input="changeQuantity(product.quantity)" :key="index"></v-text-field></td>
          <td>{{ product.price }} €</td>
        </tr>
        <tr class="font-weight-bold">
          <td></td>
          <td>Total</td>
          <td>{{ totalPrice }} € TTC</td>
        </tr>
        </tbody>
      </template>
    </v-simple-table>

    <v-row justify="center">
      <v-col cols="6">
        <v-btn block rounded size="x-large" color="#6750A4" style="color:white" class="mt-10"
               :disabled="!isFormValidComputed" @click="createBill">Enregistrer
        </v-btn>
      </v-col>
    </v-row>

    <ConfirmationPopin :is-display="displayConfirmation" @close="displayConfirmation=false"
                       :message="confirmationMessage"/>

  </div>
</template>

<script>
import ConfirmationPopin from "@/components/ConfirmationPopin";
import Constants from "@/constants";

export default {
  name: 'CreateBuyOrSale',
  components: {ConfirmationPopin},
  data() {
    return {
      products: [],
      customers: [],
      transactionsToSendInDb: [],
      productsToDisplayInBill: [],
      selectedProduct: null,
      selectedCustomer: null,
      errorMessageProduct: '',
      isFormValid: false,
      confirmationMessage: "Votre facture a bien été enregistrée",
      displayConfirmation: false,
      transaction: {}
    }
  },
  methods: {
    logSelectedProduct() {
      this.errorMessageProduct = ''
      console.log("SELECTED PRODUCT", this.selectedProduct)
    },
    logSelectedCustomer() {
      console.log("SELECTED CUSTOMER", this.selectedCustomer)
    },
    changeQuantity(quantity) {
      console.log('ici')
      this.transaction = {
        quantity: quantity,
        buying: true,
        deviceId: this.selectedProduct?.id,
        customerId: this.selectedCustomer
      }

      const productToDisplay = this.getProductToDisplay();

      const index = this.productsToDisplayInBill.findIndex(product => product.id === this.transaction.deviceId);
      this.productsToDisplayInBill.splice(index, 1, productToDisplay)

      const index2 = this.transactionsToSendInDb.findIndex(product => product.id === this.transaction.deviceId)
      this.transactionsToSendInDb.splice(index2, 1, this.transaction)

      console.log(this.transactionsToSendInDb)

    },
    addProduct() {
      this.transaction = {
        quantity: 1,
        buying: true,
        deviceId: this.selectedProduct?.id,
        customerId: this.selectedCustomer
      }

      const productToDisplay = this.getProductToDisplay();

      console.log("TRANSACTION", this.transaction)
      console.log("PRODUCT TO DISPLAY", productToDisplay)

      if (this.selectedProduct) {
        this.transactionsToSendInDb.push(this.transaction)
        this.productsToDisplayInBill.push(productToDisplay)
      } else {
        this.errorMessageProduct = 'Veuillez sélectionner un produit'
      }

      console.log(this.transactionsToSendInDb)
    },
    getProductToDisplay() {
      return {
        quantity: this.transaction.quantity,
        name: this.selectedProduct?.name,
        price: this.selectedProduct?.price * this.transaction.quantity
      }
    },
    async createBill() {
      let data;
      try {
        data = await this.$store.state.axiosBaseUrl.post('/bills', {date: new Date(Date.now())}, {
          headers: Constants.HEADERS
        })
      } catch (e) {
        console.error(e)
        if (e.response.status === 401) await this.$router.replace({path: '/'})
      }

      const billId = data.data

      let transactionsWithBillId = []

      this.transactionsToSendInDb.forEach(transaction => transactionsWithBillId.push([
        transaction.quantity, transaction.buying, transaction.deviceId, transaction.customerId, billId
      ]))

      let response;
      try {
        response = await this.$store.state.axiosBaseUrl.post('/transactions', transactionsWithBillId, {
          headers: Constants.HEADERS
        })
      } catch (e) {
        console.error(e)
        if (e.response.status === 401) await this.$router.replace({path: '/'})
      }

      this.displayConfirmation = true

    }
  },
  computed: {
    totalPrice() {
      let totalPrice = 0
      this.productsToDisplayInBill.forEach(transaction => {
        totalPrice += transaction.price
      })
      return totalPrice
    },
    isFormValidComputed() {
      return (this.transactionsToSendInDb.length > 0 && (this.selectedCustomer))
    },
    productsToDisplayInBillComputed() {
      return this.productsToDisplayInBill
    }
  },
  async mounted() {

    let data1;
    let data2;
    try {
      if (this.$store.state.products.length > 0) {
        this.products = this.$store.state.products
      } else {
        data1 = await this.$store.state.axiosBaseUrl.get("/devices", {
          headers: Constants.HEADERS
        })
        this.products = data1.data
        this.$store.commit('setProducts', this.products)
      }

      if (this.$store.state.customers.length > 0) {
        this.customers = this.$store.state.customers
      } else {
        data2 = await this.$store.state.axiosBaseUrl.get("/customers", {
          headers: Constants.HEADERS
        })
        this.customers = data2.data
        this.$store.commit('setCustomers', this.customers)
      }
    } catch (e) {
      console.error(e)
      if (e.response.status === 401) await this.$router.replace({path: '/'})
    }


  }

}

</script>

<style scoped>
.productColumn {
  width: 60%

}

</style>