<template>
  <v-card v-if="!isDetailedCard"
      class="mx-auto"
      :max-width="!$vuetify.breakpoint.xs ? '70%' : '85%'"
      outlined
  >
    <v-list-item three-line>

      <v-icon v-if="!$vuetify.breakpoint.xs" x-large color="#6750A4" class="ml-10 mr-10">mdi-account-outline</v-icon>
      <v-list-item-content class="justifyLeft">
        <v-list-item-title class="text-h5 mb-1">
          {{ companyName }}
        </v-list-item-title>
      </v-list-item-content>

    </v-list-item>

  </v-card>

  <v-card v-else
          class="mx-auto cardDesign"
          :max-width="!$vuetify.breakpoint.xs ? '70%' : '85%'"
          outlined

  >
    <v-list-item three-line>

      <v-icon v-if="!$vuetify.breakpoint.xs" x-large color="#6750A4" class="ml-10 mr-10">mdi-account</v-icon>
      <v-list-item-content class="justifyLeft">
        <v-list-item-title class="text-h5 mb-1 font-weight-bold ">
          {{ companyName }}
        </v-list-item-title>
        <v-list-item-subtitle>SIRET : {{ siret }}</v-list-item-subtitle>
        <v-list-item-subtitle>Téléphone :  {{ phoneNumber }}</v-list-item-subtitle>
      </v-list-item-content>

    </v-list-item>

  </v-card>
</template>

<script>
export default {
  name: "CustomerCard",
  props: {
    companyName: {
      type: String,
      required: true
    },
    siret: {
      type: String
    },
    phoneNumber: {
      type: String
    },
    isDetailedCard: {
      type: Boolean,
      default: false
    }
  }
}

</script>

<style scoped>
.formatCard {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

}

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

.cardDesign {
  border-width: medium;
  border-color: #6750A4;
}

</style>
