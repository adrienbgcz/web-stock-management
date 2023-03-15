<template>
  <v-btn fab dark large color="#6750A4" fixed right bottom class="button" @click="$emit('openForm')">{{content}}</v-btn>
</template>

<script>
export default {
  name: "FloatingButton",
  props: {
    content: {
      type: String
    }
  }
}
</script>

<style scoped>
.button {
  font-size: 30px;
}
</style>