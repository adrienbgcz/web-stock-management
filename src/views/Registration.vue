<template>
  <PopinForm :is-registration=true :element-to-add-in-db="elementToAddInDb"
             :input-labels-and-api-name="addProductLabelsAndApiName" :title="'Inscription'" :confirmation-message="confirmationMessage"/>

</template>

<script>
import PopinForm from "@/components/PopinForm";

export default {
  name: "Registration",
  components: {
    PopinForm
  },
  data() {
    return {
      elementToAddInDb: "user",
      confirmationMessage: "Votre compte a été créé avec succès",
      pseudo: {
        label: "Pseudo",
        apiName: "pseudo",
        type: "lengthLettersNumbers",
        errorMessage: "Ce champ doit être renseigné et contenir entre 2 et 20 characters et uniquement des chiffres et des lettres."
      },
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
      passwordConfirmation: {
        label: "Confirmation du mot de passe",
        apiName: "passwordConfirmation",
        type: "passwordConfirmation",
        errorMessage: "Les 2 mots de passe doivent être identiques"
      },
    }
  },
  computed: {
    addProductLabelsAndApiName() {
      return [this.pseudo, this.email, this.password, this.passwordConfirmation]
    }
  }
}
</script>

<style scoped>

</style>