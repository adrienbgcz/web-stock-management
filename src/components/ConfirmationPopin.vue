<template>
  <div class="text-center">
      <v-dialog
          v-model="this.isDisplayComputed"
          activator="parent"
          width="auto"
      >
        <v-card>
          <v-card-text class="pa-6">
            {{ message }}
          </v-card-text>
          <v-card-actions>
            <v-btn color="#6750A4" @click="$emit('close')" class="mb-4"><span style="color: white">OK</span></v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
  </div>
</template>

<script>
export default {
  name: "ConfirmationPopin",
  data () {
    return {
      dialog: false
    }
  },
  props: {
    isDisplay: {
      type: Boolean
    },
    message: {
      type: String,
      required: true
    }
  },
  computed: {
    isDisplayComputed() {
      return this.isDisplay
    }
  }
}
</script>

<style scoped>

</style>