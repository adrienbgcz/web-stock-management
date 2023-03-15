<template>
  <v-card v-if="!isDetailedCard"
      class="mx-auto"
      max-width="70%"
      outlined
  >
    <v-list-item three-line>

      <v-icon x-large color="#6750A4" class="ml-10 mr-10">mdi-devices</v-icon>
      <v-list-item-content class="justifyLeft">
        <v-list-item-title class="text-h5 mb-1">
          {{ productName }} - {{ price }} €
        </v-list-item-title>
        <span class="stockFormat">Stock : {{ stock }}</span>
      </v-list-item-content>


      <v-img :src="picture" max-width="100px" class="mt-1 mb-1 mr-10"/>
    </v-list-item>

  </v-card>

  <v-card v-else
          class="mx-auto"
          max-width="70%"
          outlined
  >
    <v-list-item >
    <div class="formatCard">
      <v-img :src="picture" max-width="400px" />

      <v-list-item-content>
        <v-list-item-title class="text-h5 mb-1">
          {{ productName }} - {{ price }} €
        </v-list-item-title>
        <v-list-item-subtitle>Numéro de série : {{ serialNumber }}</v-list-item-subtitle>
        <span class="stockFormat mt-1">Stock : {{ stock }}</span>
      </v-list-item-content>
    </div>

    </v-list-item>

  </v-card>


</template>

<script>
export default {
  name: "ProductCard",
  props: {
    productName: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    stock: {
      type: Number,
      required: true
    },
    picture: {
      type: String,
    },
    serialNumber: {
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

</style>
