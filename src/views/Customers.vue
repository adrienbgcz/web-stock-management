<template>
  <div class="home">
    <div :style="!$vuetify.breakpoint.xs ? 'width:70%; margin:auto' : 'width:85%; margin:auto'">
      <v-text-field
          outlined
          label="Rechercher"
          prepend-inner-icon="mdi-magnify"
          v-model="searchedTerm"
          @input="search"
      ></v-text-field>
    </div>


    <div v-if='customersList.length !== 0' v-for="customer in filteredCustomersList" :key="customer.id" >
      <router-link :to="`/customer-details/${customer.id}`">
        <CustomerCard :company-name="customer.company_name" class="mt-10"/>
      </router-link>
    </div>
    <div class="my-2">
      <PopinForm :input-labels-and-api-name="addCustomerLabelsAndApiName" :element-to-add-in-db="'customer'"
                 :title="'Ajouter un partenaire'" :icon="'mdi-account-outline'" :confirmation-message="'Le partenaire a bien été ajouté'"/>
    </div>

  </div>
</template>

<script>

import CustomerCard from "@/components/CustomerCard"
import FloatingButton from "@/components/FloatingButton"
import PopinForm from "@/components/PopinForm";

export default {
  name: 'Home',
  components: {
    PopinForm,
    FloatingButton,
    CustomerCard,
  },
  data() {
    return {
      customers: [],
      filteredCustomers: [],
      searchedTerm: "",
      customerName: {
        label: "Nom du partenaire",
        apiName: "company_name",
        type: "lengthLettersNumbers",
        errorMessage: "Ce champ doit être renseigné et contenir entre 2 et 20 characters et uniquement des chiffres et des lettres."
      },
      siret: {
        label: "SIRET",
        apiName: "siret",
        type: "lengthLettersNumbers",
        errorMessage: "Ce champ doit être renseigné et contenir entre 2 et 20 characters et uniquement des chiffres et des lettres."
      },
      phoneNumber: {
        label: "Numéro de téléphone",
        apiName: "phone_number",
        type: "phoneNumber",
        errorMessage: "Ce champ doit être renseigné et contenir 10 chiffres"
      },
    }
  },
  computed: {
    customersList() {
      return this.customers
    },
    addCustomerLabelsAndApiName() {
      return [this.customerName, this.siret, this.phoneNumber]
    },
    filteredCustomersList() {
      return this.filteredCustomers
    }
  },
  methods: {
    search() {
      this.filteredCustomers = this.customersList.filter(customer => customer.company_name.toLowerCase().includes(this.searchedTerm.toLowerCase()))
    }
  },
  async mounted() {
    if(this.$store.state.customers.length > 0) {
      this.customers = this.$store.state.customers
    } else {
        const {data} = await this.$store.state.axiosBaseUrl.get("/customers")
        this.customers = data
        this.$store.commit('setCustomers', data)
    }
    this.filteredCustomers = this.customers
  }
}
</script>

<style >
.v-text-field fieldset, .v-text-field .v-input__control, .v-text-field .v-input__slot {
  color: #6750A4!important;
  border-width: medium;
}

</style>
