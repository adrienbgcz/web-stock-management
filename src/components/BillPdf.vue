<template>
  <div>
    <div v-if="!$vuetify.breakpoint.xs" @click="goBack" class="return mb-6 text-center">
      RETOUR
    </div>
    <VueHtml2pdf
        :show-layout="false"
        :float-layout="true"
        :enable-download="false"
        :preview-modal="true"
        :paginate-elements-by-height="1400"
        :filename="billName"
        :pdf-quality="2"
        :manual-pagination="false"
        pdf-format="a4"
        pdf-orientation="landscape"
        pdf-content-width="100%"
        ref="html2Pdf"
    >
      <section slot="pdf-content" class="pdfContent">
        <div class="header">
          <div class="myCompany">
            <span>My company</span><br/>
            <span>SIRET: 1234567891234</span>
            <span>10 rue des Coquelicots</span>
            <span>62400 BETHUNE</span>
          </div>
          <div class="client">
            <span>{{ company }}</span>
            <span>SIRET: {{ siret }}</span>
            <span>Tel: {{ phoneNumber }}</span>
          </div>
        </div>
      </section>
    </VueHtml2pdf>
  </div>
</template>

<script>
import VueHtml2pdf from 'vue-html2pdf'
import Constants from "@/constants";

export default {
  name: "BillPdf",
  data() {
    return {
      billName: `commande#${this.$route.orderId}`,
      allTransactionByCustomersAndBillId: [],
      company: '',
      siret: '',
      phoneNumber: ''
    }
  },
  computed: {
    /*companyComputed() {
      console.log('ici')
      return this.company ? this.company : {name: "Loading", adress: "Loading"}
    },*/
    /*customerComputed() {
      return this.customer ? this.customer : {name: "Loading", email: '', description: ''}

    }
*/
  },
  components: {
    VueHtml2pdf,
  },
  async mounted() {
    let data1;
    let data2;
    try {
      data1 = await this.$store.state.axiosBaseUrl.get(`customers/${this.$route?.params.customerId}`, {
        headers: Constants.HEADERS
      })
      this.company = data1.data[0].company_name
      this.siret = data1.data[0].siret
      this.phoneNumber = data1.data[0].phone_number
      data2 = await this.$store.state.axiosBaseUrl.get(`/customers/${this.$route?.params.customerId}/bills/${this.$route?.params.billId}/transactions`, {
        headers: Constants.HEADERS
      })
      this.allTransactionByCustomersAndBillId = data2.data
      console.log(this.allTransactionByCustomersAndBillId)
      this.generateReport()
    } catch (e) {
      console.error(e)
      if (e.response.status === 401) await this.$router.replace({path: '/'})
    }

  },
  methods: {
    generateReport() {
      this.$refs.html2Pdf.generatePdf()
    },
    goBack() {
      this.$router.go(-1);
    }
  },
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

.myCompany {
  display: flex;
  flex-direction: column;
  width: 40%;
  padding: 10px;
  background-color: whitesmoke;
  font-family: Arial, sans-serif;
  height: fit-content;
}

.pdfContent {
  margin: auto;
  width: 90%;
  padding: 40px;
  border: solid;

}

.client {
  display: flex;
  flex-direction: column;
  border: solid;
  border-width: medium;
  color: black;
  padding: 40px;
  width: 50%;
  margin-top: 100px;
  font-family: Arial, sans-serif;
  font-size: large;
}

.header {
  display: flex;
  justify-content: space-between;

}

</style>