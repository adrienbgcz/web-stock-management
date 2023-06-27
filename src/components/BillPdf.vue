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

        <div>Facture éditée le : {{billDate}}</div>

        <v-simple-table class="table">
          <template v-slot:default>
            <thead>
            <tr>
              <th class="textLeft productColumn">
                Produit
              </th>
              <th class="textLeft">
                Quantité
              </th>
              <th class="textLeft">
                Prix
              </th>
              <th>
              </th>
            </tr>
            </thead>
            <tbody>
            <tr
                v-for="(product) in allTransactionByCustomersAndBillId"
                :key="product.id">

              <td>{{ product.name }}</td>
              <td>{{ product.quantity }}</td>
              <td>{{ product.price }} €</td>
            </tr>
            <tr class="totalPrice">
              <td></td>
              <td>Total</td>
              <td>{{ totalPrice }} € TTC</td>
            </tr>
            </tbody>
          </template>
        </v-simple-table>

        <footer class="footer" >
          <p>© 2023 Stock management</p>
        </footer>
        <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
      </section>
    </VueHtml2pdf>
  </div>
</template>

<script>
import VueHtml2pdf from 'vue-html2pdf'
import Constants from "@/constants"
import Moment from 'moment'

export default {
  name: "BillPdf",
  components: {
    VueHtml2pdf,
  },
  data() {
    return {
      billName: `commande#${this.$route.orderId}`,
      allTransactionByCustomersAndBillId: [],
      company: '',
      siret: '',
      phoneNumber: '',
      billDate: ''
    }
  },
  methods: {
    generateReport() {
      this.$refs.html2Pdf.generatePdf()
    },
    goBack() {
      this.$router.go(-1)
    }
  },
  computed: {
    totalPrice() {
      let total = 0
      this.allTransactionByCustomersAndBillId.forEach(transaction => total += transaction.price)
      return total
    }
  },

  async mounted() {
    let data1;
    let data2;
    let data3;
    try {
      data1 = await this.$store.state.axiosBaseUrl.get(`customers/${this.$route?.params.customerId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem("token")
        }
      })
      this.company = data1.data[0].company_name
      this.siret = data1.data[0].siret
      this.phoneNumber = data1.data[0].phone_number
      data2 = await this.$store.state.axiosBaseUrl.get(`/customers/${this.$route?.params.customerId}/bills/${this.$route?.params.billId}/transactions`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem("token")
        }
      })
      this.allTransactionByCustomersAndBillId = data2.data

      data3 = await this.$store.state.axiosBaseUrl.get(`bills/${this.$route?.params.billId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem("token")
        }
      })
      this.billDate = Moment(data3.data[0]).utc().format('DD/MM/YYYY')

      this.generateReport()
    } catch (e) {
      console.error(e)
      if (e.response.status === 401) await this.$router.replace({path: '/'})
    }
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
/*  border: solid;*/
}

.client {
  display: flex;
  flex-direction: column;
  border: solid;
  border-width: thin;
  color: black;
  padding: 40px;
  width: 50%;
  margin-top: 100px;

}

.header {
  display: flex;
  justify-content: space-between;

}

.productColumn {
  width: 60%
}

.textLeft {
  text-align: left;
}

.pdfContent {
  font-family: Arial, serif;
}

.totalPrice {
  font-weight: bold;
}

.table {
  margin-top: 40px;
}

.footer {
  position: absolute;
  bottom: 20px;
}

</style>