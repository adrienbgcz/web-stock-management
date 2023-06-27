<template>
  <div class="about">
    <h1>Editer une facture</h1>

    <v-autocomplete
        v-model="selectedCustomer"
        @change="transaction.customerId = selectedCustomer"
        :items="customers"
        item-text="company_name"
        item-value="id"
        dense
        filled
        label="Choose a customer"
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
            :disabled="!this.selectedCustomer"

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
          <th>
          </th>
        </tr>
        </thead>
        <tbody>
        <tr
            v-for="(product, index) in productsToDisplayInBillComputed"
            :key="product.id">
          <td>{{ product.name }}</td>
          <td><div style="width: 60px"><input size="30px" type="number" min="1" step="1" :max="product.stockQuantity" v-model.number="product.quantity" @input="changeQuantity(product)"><div style="color: darkgrey">max:{{product.stockQuantity}}</div></div></td>
          <td>{{ product.price }} €</td>
          <td><v-icon @click="deleteProduct(index)">mdi-delete</v-icon></td>
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
               :disabled="!isFormValidComputed" @click="createBill" :loading="isLoadingComputed">Enregistrer
        </v-btn>
      </v-col>
    </v-row>

    <ConfirmationPopin :is-display="displayConfirmation && !isLoadingComputed" @close="displayConfirmation=false"
                       :message="isCreateBillError ? errorMessageCreateBill : confirmationMessage"/>


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
      transaction: {},
      isLoading: false,
      isCreateBillError: false,
      errorMessageCreateBill: "Une erreur est survenue pendant l'enregistrement"
    }
  },
  methods: {
    print() {
      console.log(this.selectedProduct)
    },
    async getProductsAndCustomers() {
      try {
        if (this.$store.state.products.length > 0) {
          this.products = this.$store.state.products
        } else {
          await this.getProducts()
        }

        if (this.$store.state.customers.length > 0) {
          this.customers = this.$store.state.customers
        } else {
          await this.getCustomers()
        }
      } catch (e) {
        console.error(e)
        if (e.response?.status === 401) await this.$router.replace({path: '/'})
      }
    },
    async getProducts() {
      let data = await this.$store.state.axiosBaseUrl.get(`/devices/user/${localStorage.userId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem("token")
        }
      })
      this.products = data.data
      this.$store.commit('setProducts', this.products)
    },
    async getCustomers() {
      let data = await this.$store.state.axiosBaseUrl.get(`/customers/user/${localStorage.userId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem("token")
        }
      })
      this.customers = data.data
      this.$store.commit('setCustomers', this.customers)
    },
    changeQuantity(product) {
      this.transaction = {
        quantity : product.quantity,
        deviceId: product.id,
        customerId: this.selectedCustomer
      }

      const productToDisplay = this.getProductToDisplay(product);

      // This array is used to format products to display in front AND check if quantity selected is valid
      const index = this.productsToDisplayInBill.findIndex(product => product.id === this.transaction.deviceId);
      this.productsToDisplayInBill.splice(index, 1, productToDisplay)

      // This array contains transactions formatted to save in database
      const index2 = this.transactionsToSendInDb.findIndex(product => product.deviceId === this.transaction.deviceId)
      this.transactionsToSendInDb.splice(index2, 1, this.transaction)

    },
    deleteProduct(index) {
      this.productsToDisplayInBill.splice(index, 1)
      this.transactionsToSendInDb.splice(index, 1)
    },
    addProduct() {
      this.transaction = {
        quantity: 1,
        deviceId: this.selectedProduct?.id,
        customerId: this.selectedCustomer
      }

      const productToDisplay = this.getProductToDisplay(this.selectedProduct);

      if (this.selectedProduct) {
        this.transactionsToSendInDb.push(this.transaction)
        this.productsToDisplayInBill.push(productToDisplay)
      } else {
        this.errorMessageProduct = 'Veuillez sélectionner un produit'
      }
    },
    getProductToDisplay(product) {
      const initialProduct = this.products.find(element => element.id === product.id)

      return {
        id: this.transaction.deviceId,
        quantity: this.transaction.quantity,
        name: initialProduct?.name,
        price: initialProduct?.price * this.transaction.quantity,
        stockQuantity: initialProduct?.stock_quantity,
        isValidSelectedQuantity: this.transaction.quantity <= initialProduct?.stock_quantity
      }
    },
    async createBill() {
      try {
        this.isLoading = true
        let data = await this.createBillAndGetBillId();
        const billId = data.data

        const transactionsWithBillId = this.transactionsToSendInDb.map(transaction => [
          transaction.quantity, transaction.deviceId, transaction.customerId, billId
        ])

        await this.postTransactions(transactionsWithBillId)

        this.isCreateBillError = false

        this.$store.commit("resetProductsAndCustomers")

      } catch(e) {
        console.error(e)
        this.isCreateBillError = true
      }
      this.isLoading = false
      this.displayConfirmation = true

    },
    async createBillAndGetBillId() {
      try {
        return await this.$store.state.axiosBaseUrl.post('/bills', {date: new Date(Date.now())}, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem("token")
          }
        })
      } catch (e) {
        console.error(e)
        if (e.response?.status === 401) await this.$router.replace({path: '/'})
        throw e
      }
    },
    async postTransactions(transactionsWithBillId) {
      try {
        await this.$store.state.axiosBaseUrl.post('/transactions', transactionsWithBillId, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem("token")
          }
        })
      } catch (e) {
        console.error(e)
        if (e.response?.status === 401) await this.$router.replace({path: '/'})
        throw e
      }
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
      const areValidQuantitiesSelected = !(this.productsToDisplayInBill.some(product => !product.isValidSelectedQuantity))
      return (this.transactionsToSendInDb.length > 0 && this.selectedCustomer && areValidQuantitiesSelected)
    },
    productsToDisplayInBillComputed() {
      return this.productsToDisplayInBill
    },
    isLoadingComputed() {
      return this.isLoading
    }
  },
  async mounted() {
    await this.getProductsAndCustomers();
  }

}

</script>

<style scoped>
.productColumn {
  width: 60%
}

input[type='number']{
  width: 50px;
}

.v-text-field input {
  text-align: center!important;
}

</style>