<template>
  <div>
    <div class="header">
      <div v-if="!$vuetify.breakpoint.xs" @click="goBack" class="return mb-6">
        < RETOUR
      </div>
<!--      <CustomerCard v-if="Object.keys(customer).length !== 0" :company-name="customer.company_name"
                    :siret="customer.siret" :phone-number="customer.phone_number" :is-detailed-card="true"
      />-->
    </div>
<!--    <div v-for="bill in bills" :key="bill.id">
      <BillNumberAndDateCard :total="bill.total" :bill-date="bill.bill_date" :bill-id="bill.id" class="mt-10"/>
    </div>-->

  </div>
</template>

<script>
import CustomerCard from "@/components/CustomerCard";
import BillNumberAndDateCard from "@/components/CustomerDetailsOrderCard";

export default {
  name: "CustomerDetails",
  components: {BillNumberAndDateCard, CustomerCard},
  data() {
    return {
      customer: {},
      bills: []
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    }
  },
  async mounted() {
    const data1 = await this.$store.state.axiosBaseUrl.get(`customers/${this.$route?.params.id}`)
    this.customer = data1.data[0]

    const data2 = await this.$store.state.axiosBaseUrl.get(`customers/${this.$route?.params.id}/bills`)
    this.bills = data2.data
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
