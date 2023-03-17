<template>
  <div>
    <div @click="goBack" class="return mb-6">
      < RETOUR
    </div>
    <ProductCard v-if="Object.keys(deviceComputed).length !== 0" :is-detailed-card="true" :product-name="deviceComputed.name" :picture="deviceComputed.picture"
                 :stock="deviceComputed.stock_quantity" :serial-number="deviceComputed.serial_number" :price="deviceComputed.price"/>
  </div>
</template>

<script>
import ProductCard from "@/components/ProductCard";

export default {
  name: "ProductDetails",
  components: {ProductCard},
  data() {
    return {
      device: {}
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    }
  },
  computed: {
    deviceComputed() {
      return this.device
    }
  },
  async mounted() {
    const {data} = await this.$store.state.axiosBaseUrl.get(`devices/${this.$route.params.id}`)
    this.device = data[0]
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

</style>