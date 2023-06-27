<template>
  <v-card
      class="mx-auto"
      :max-width="!$vuetify.breakpoint.xs ? '70%' : '85%'"
      outlined
  >
    <v-list-item three-line>

      <v-icon v-if="!$vuetify.breakpoint.xs" x-large color="#6750A4" class="ml-10 mr-10">mdi-cart</v-icon>
      <v-list-item-content class="justifyLeft">
        <v-list-item-title :class="!$vuetify.breakpoint.xs ? 'text-h6' : 'text-h7'" class="mb1">
          Commande #{{ billId }}
        </v-list-item-title>
        <v-list-item-subtitle>{{ billDateFormated }}</v-list-item-subtitle>
      </v-list-item-content>
      <span class="font-weight-bold">{{ total }} €</span>
    </v-list-item>

  </v-card>

</template>

<script>
import Moment from 'moment'
export default {
  name: "BillNumberAndDateCard",
  data(){
    return {
      billDateFormated: Moment(this.billDate).utc().format('DD/MM/YYYY')
    }
  },
  props: {
    billId: {
      type: Number,
      required: true
    },
    billDate: {
      type: String,
      required: true
    },
    total: {
      type: Number,
      required: true
    }
  }
}

</script>

<style scoped>
.v-list-item {
  justify-content: center;
}

.v-list-item__content {
  text-align: center;
}

.stockFormat {
  color: green;
}

.justifyLeft {
  text-align: left;
}

</style>
