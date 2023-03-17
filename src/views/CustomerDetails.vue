<template>
  <div>
    <div class="header">
      <div v-if="!$vuetify.breakpoint.xs" @click="goBack" class="return mb-6">
        < RETOUR
      </div>
      <CustomerCard v-if="Object.keys(customer).length !== 0" :company-name="customer.company_name"
                    :siret="customer.siret" :phone-number="customer.phone_number" :is-detailed-card="true"/>
    </div>
  </div>
</template>

<script>
import CustomerCard from "@/components/CustomerCard";

export default {
  name: "CustomerDetails",
  components: {CustomerCard},
  data() {
    return {
      customer: {}
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    }
  },
  async mounted() {
    const {data} = await this.$store.state.axiosBaseUrl.get(`customers/${this.$route.params.id}`)
    this.customer = data[0]
    console.log(this.customer)
  }
}
</script>

<style scoped>
.return {
  cursor: pointer;
  font-size: 30px;
  font-weight: bold;
  font-style: italic;
  color: #6750A4;

}

.return:hover {
  text-decoration: underline;
}

.header {
  display: flex;
  justify-content: space-around;
}

</style>