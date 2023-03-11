<template>
  <v-app>
    <v-app-bar
        color="#6750A4"
        dense
        dark
        class="pt-2 pb-2"
        height="auto"

    >


      <v-toolbar-title>Stock Management</v-toolbar-title>

      <v-spacer></v-spacer>

      <router-link to="/">
        <v-btn color="#6750A4">
          <div>
            <v-icon x-large>mdi-devices</v-icon>
            <div class="mt-1">Produits</div>
          </div>
        </v-btn>
      </router-link>

      <v-spacer></v-spacer>


      <router-link to="/contacts">
        <v-btn color="#6750A4">
          <div>
            <v-icon x-large>mdi-account-group</v-icon>
            <div class="mt-1">Répertoire</div>
          </div>
        </v-btn>
      </router-link>

      <v-spacer></v-spacer>


      <router-link to="/buy-or-sale">
        <v-btn color="#6750A4">
          <div>
            <v-icon x-large>mdi-file-document-plus</v-icon>
            <div class="mt-1">Achats - Ventes</div>
          </div>
        </v-btn>
      </router-link>

      <v-spacer></v-spacer>
    </v-app-bar>

    <v-main>
      <router-view/>
    </v-main>

    <div style="height: 400px">TEST</div>
  </v-app>


</template>

<script>
export default {
  name: "App",

  data: () => ({
    //
  }),
};
</script>
<style scoped>
.v-toolbar__content, .v-toolbar__extension {
  margin-top: 15px;
}

.v-btn--is-elevated {
  box-shadow: none;
}

.v-btn:not(.v-btn--round).v-size--default {
  height: 70px;
}
</style>


<style>

.v-application--wrap {
  min-height: 0;
}
</style>