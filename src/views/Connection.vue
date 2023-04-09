<template>
  <div>
    <PopinForm :is-connection=true :element-to-add-in-db="elementToCheckInDb"
               :input-labels-and-api-name="addProductLabelsAndApiName" :title="'Connexion'"/>


  </div>
</template>

<script>
import PopinForm from "@/components/PopinForm";

export default {
  name: "Connection",
  components: {PopinForm},
  data() {
    return {
      elementToCheckInDb: "userConnection",
      email: {
        label: "Adresse email",
        apiName: "email",
        type: "email",
        errorMessage: "Format de l'adresse invalide"
      },
      password: {
        label: "Mot de passe",
        apiName: "password",
        type: "password",
        errorMessage: "Le mot de passe doit contenir entre 8 et 20 charactères, dont au moins 1 lettre minuscule, 1 lettre majuscule et 1 caractère spécial"
      },
    }
  },
  computed: {
    addProductLabelsAndApiName() {
      return [this.email, this.password]
    }
  }
}


</script>

<style scoped>

</style>