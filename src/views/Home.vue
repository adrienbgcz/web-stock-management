<template>
  <div class="home">
    <navbarConnectionInscription />
    <div class="h-75/100 flex">
      <div class="w-60/100">
        <div class="p-5">
          <p class="color-blue" style="font-size: 30px;"> MON ENTREPRISE</p>
        </div>
        <div class="p-5">
          <p style="color:white;font-weight: bold;font-size: 60px;">Créez votre Site de Commande <br> En Ligne en <span class="color-blue">15 Minutes</span></p>
        </div>
        <div class="p-5">
          <p style="color:#6D7074;font-size: 20px;">Choisissez votre type de commerce, ajoutez vos produits, renseignez vos informations de contact et vos clients pourront passer commande en ligne en indiquant leur horaire de retrait.</p>
        </div>
      </div>
      <div class="w-40/100 border-t-cyan-500 p-5 mx-auto">
        <img src="./../assets/images/imgAccueil.jpg"  style="width: 400px; height: 600px;" alt="Image de presentation de la page d'accueil">
      </div>
    </div>
  </div>
</template>

<script>

import navbarConnectionInscription from "../components/navbarConnectionInscription.vue"

export default {
  name: 'Home',
  components: {
    navbarConnectionInscription
  },
  async mounted() {
    if(localStorage.getItem('token')) await this.$router.replace({path: '/accueil'})
  }
}

</script>

<style scoped lang="scss">

$color : #00E1FF;

.home{
  background-color: #13161C;
  width: 100%;
  height: 100vh;
}
.tailleDivBouton{
  height: 75px;
  margin:15px
}
.color-blue{
  color: $color
}
//////////////

</style>
