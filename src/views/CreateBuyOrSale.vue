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
            v-for="product in productsToDisplayInBill"
            :key="product.id">

          <td>{{ product.name }}</td>
          <td>1</td>
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

    <ConfirmationPopin :is-display="displayConfirmation" @close="displayConfirmation=false" :message="confirmationMessage"  />

  </div>
</template>

<script>
import ConfirmationPopin from "@/components/ConfirmationPopin";

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
      displayConfirmation: false
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
    addProduct() {
      const transaction = {
        quantity: 1,
        buying: true,
        deviceId: this.selectedProduct?.id,
        customerId: this.selectedCustomer
      }

      const productToDisplay = {
        quantity: 1,
        name: this.selectedProduct?.name,
        price: this.selectedProduct?.price
      }

      if (this.selectedProduct) {
        this.transactionsToSendInDb.push(transaction)
        this.productsToDisplayInBill.push(productToDisplay)
      } else {
        this.errorMessageProduct = 'Veuillez sélectionner un produit'
      }
    },
    async createBill() {

      const {data} = await this.$store.state.axiosBaseUrl.post('/bills', {date: new Date(Date.now()).toLocaleString()}, {
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const billId = data

      let transactionsWithBillId = []

      this.transactionsToSendInDb.forEach(transaction => transactionsWithBillId.push([
        transaction.quantity, transaction.buying, transaction.deviceId, transaction.customerId, billId
      ]))
       console.log(transactionsWithBillId)

      await this.$store.state.axiosBaseUrl.post('/transactions', transactionsWithBillId, {
        headers: {
          'Content-Type': 'application/json'
        }
      })

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
    }
  },
  async mounted() {
    const options = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
    const date = new Date(Date.now()).toLocaleString()
    console.log(date)
    if (this.$store.state.products.length > 0) {
      this.products = this.$store.state.products
    } else {
      const {data} = await this.$store.state.axiosBaseUrl.get("/devices")
      this.products = data
      this.$store.commit('setProducts', data)
    }

    if (this.$store.state.customers.length > 0) {
      this.customers = this.$store.state.customers
    } else {
      const {data} = await this.$store.state.axiosBaseUrl.get("/customers")
      this.customers = data
      this.$store.commit('setCustomers', data)
    }

  }

}

</script>

<style scoped>
.productColumn {
  width: 60%

}

</style>