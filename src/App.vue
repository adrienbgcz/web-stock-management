<template>
  <v-app>
    <v-app-bar
        color="#6750A4"
        dense
        dark
        class="pt-2 pb-2 mb-10"
        height="auto"
    >

      <v-toolbar-title v-if="userConnected">Bonjour {{ userConnected }} ! <div class="disconnectionButton mt-1" @click="disconnection">Déconnexion</div></v-toolbar-title>
      <v-toolbar-title v-else>Stock Management</v-toolbar-title>


      <v-spacer></v-spacer>

      <router-link to="/products">
        <v-btn color="#6750A4">
          <div>
            <v-icon x-large>mdi-devices</v-icon>
            <div class="mt-1">Produits</div>
          </div>
        </v-btn>
      </router-link>

      <v-spacer></v-spacer>


      <router-link to="/customers">
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
            <div class="mt-1">Editer une facture</div>
          </div>
        </v-btn>
      </router-link>

      <v-spacer></v-spacer>
    </v-app-bar>

    <v-main :style="!$vuetify.breakpoint.xs ? 'width: 85%; margin: auto' : 'width: 95%; margin: auto' ">
      <router-view/>
    </v-main>

  </v-app>


</template>

<script>

import Constants from "@/constants";

export default {
  name: "App",

  data() {
    return {
      user: {}
    }
  },
  methods: {
    disconnection() {
      localStorage.removeItem('token')
      localStorage.removeItem('userId')
      this.$router.replace({path: '/'})
    }
  },
  computed: {
    userConnected() {
      return this.$store.state.userPseudo
    }
  },
  async mounted() {
    if (localStorage.userId) {
      try {
        const data = await this.$store.state.axiosBaseUrl.get(`/users/${localStorage.userId}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem("token")
          }
        })
        this.user = data.data
        this.$store.commit('setUserPseudo', this.user.pseudo)
        if(this.$route.path === "/") await this.$router.replace({path: '/products'})

      } catch(e) {
        console.error(e)
        if(e.response?.status === 401) {
          this.$store.commit("deleteUserPseudo")
          localStorage.removeItem('userId')
          localStorage.removeItem('token')
          await this.$router.replace({path: '/'})
        }
      }
    }
  }
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

* {
  text-decoration: inherit;
}

.disconnectionButton {
  font-size: small;
  text-decoration: underline;
}

.disconnectionButton:hover {
  cursor: pointer;
}
</style>