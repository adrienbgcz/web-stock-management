<template>
  <v-row justify="center">
    <v-dialog
        v-model="dialog"
        persistent
        :width="!$vuetify.breakpoint.xs ? '50%' : '80%'"
    >
      <template v-slot:activator="{ props }" v-if="!isRegistration && !isConnection">
        <FloatingButton v-bind="props" @openForm="dialog=true" :content="'+'"/>
      </template>
      <v-card>
        <div class="headerIcon pt-6">
          <v-icon x-large color="#6750A4">{{ icon }}</v-icon>
        </div>

        <v-card-title>
          <span class="text-h6 text-center">{{ title }}</span>
        </v-card-title>

        <v-card-text v-if="displayConnectionErrorMessageComputed">
          <v-container>
            <v-row>
              <v-col class="text-center">
                {{ connectionOrRegistrationError }}
<!--                Identifiants incorrects !-->
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-text v-else>
          <v-container>
            <div v-if="imageData!=null" class="previewPictureCss">
              <img v-if="previewPicture" class="preview mb-3" height="268" width="356" :src="previewPicture">
            </div>
            <v-row v-for="inputInfo in inputLabelsAndApiName" :key="inputInfo.apiName">
              <v-col cols="12">
                <v-file-input v-if="inputInfo.type === 'picture'"
                              :rules="rules"
                              accept="image/png, image/jpeg, image/bmp"
                              placeholder="Ajouter une image"
                              prepend-icon="mdi-camera"
                              label="Ajouter une image"
                              @change="validInput(inputInfo.type, inputLabelsFormatted[inputInfo.apiName].value, inputInfo.apiName, inputInfo.label); previewAddedPicture($event)"
                ></v-file-input>
                <v-text-field v-else
                              :type="inputInfo.type === 'password' || inputInfo.type === 'passwordConfirmation' ? 'password' : 'text'"
                              :label="inputInfo.label + ' *'"
                              :placeholder="inputInfo.label"
                              :error-messages="firstDisplay ? '' : inputLabelsFormatted[inputInfo.apiName] ? !inputLabelsFormatted[inputInfo.apiName].isValidatedData ? inputLabelsFormatted[inputInfo.apiName].errorMessage : '' : ''"
                              outlined
                              required
                              v-model="inputLabelsFormatted[inputInfo.apiName].value"
                              @input="validInput(inputInfo.type, inputLabelsFormatted[inputInfo.apiName].value, inputInfo.apiName, inputInfo.label)"
                ></v-text-field>
              </v-col>
            </v-row>

            <ConfirmationPopin :is-display="displayConfirmationComputed"
                               @close="displayConfirmation=false" :message="isError ? errorMessage : confirmationMessage" />
          </v-container>
          <small>* Obligatoire</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
              v-if="!isRegistration && !isConnection"
              color="white"
              variant="text"
              elevation="0"
              @click="dialog = false; initializeForm()"
          >
            <span class="popinButtons">Annuler</span>
          </v-btn>

          <router-link to="/">
            <span class="popinButtons mr-4" v-if="isRegistration">Déjà inscrit ? Me connecter</span>
          </router-link>

          <router-link to="/registration">
            <span class="popinButtons mr-4" v-if="isConnection">Pas encore inscrit ? S'inscrire</span>
          </router-link>

          <div class="text-center" v-if="isLoadingComputed">
            <v-progress-circular
                indeterminate
                color="#6750A4"
                width="5"
                size="30"
            />
          </div>

          <v-btn
              v-else-if="!displayConnectionErrorMessageComputed && !isLoadingComputed"
              color="white"
              variant="text"
              elevation="0"
              :disabled="manageValidateButton"
              @click="add()"
          >
            <span class="popinButtons">Valider</span>
          </v-btn>
          <span v-else class="popinButtons" @click="displayConnectionErrorMessage = false">Réessayer</span>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import FloatingButton from "@/components/FloatingButton";
import ConfirmationPopin from "@/components/ConfirmationPopin";
import firebase from "firebase/compat";
import Constants from "@/constants";

export default {
  components: {ConfirmationPopin, FloatingButton},
  data: () => ({
    dialog: false,
    inputLabelsFormatted: {},
    isValidatedDataForm: false,
    isFound: false,
    errors: [],
    firstDisplay: true,
    displayConfirmation: false,
    rules: [
      value => {
        return !value || !value.length || value[0].size < 2000000 || 'Avatar size should be less than 2 MB!'
      },
    ],
    imageData: "",
    firebaseUrl: "",
    uploadValue: 0,
    previewPicture: null,
    samePasswords: false,
    displayConnectionErrorMessage: false,
    isLoading: false,
    isError: false,
    connectionOrRegistrationError: ''
  }),
  props: {
    inputLabelsAndApiName: {
      type: Array,
      required: true
    },
    elementToAddInDb: {
      type: String,
      required: true
    },
    title: {
      type: String
    },
    icon: {
      type: String
    },
    confirmationMessage: {
      type: String,
    },
    errorMessage: {
      type: String,
    },
    isRegistration: {
      type: Boolean,
      default: false
    },
    isConnection: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    manageValidateButton() {
      return Object.values(this.inputLabelsFormatted).find(value => value.isValidatedData === false) ? true : false
    },
    displayConfirmationComputed() {
      return this.displayConfirmation
    },
    displayConnectionErrorMessageComputed() {
      return this.displayConnectionErrorMessage
    },
    isLoadingComputed() {
      return this.isLoading
    }
  },
  methods: {
    validInput(type, value, apiName, label) {
      let regex = ""
      this.isFound = false

      switch (type) {
        case "lengthLettersNumbers" :
          regex = /^[a-zA-Z0-9éèàêïî ]{2,20}$/
          this.setValidatedData(value, regex, apiName, type)
          break;
        case "integer" :
          regex = /^[0-9]{1,10}$/
          this.setValidatedData(value, regex, apiName, type)
          break;
        case "double" :
          regex = /^[0-9]{1,10}(\.[0-9]{0,2})?$/
          this.setValidatedData(value, regex, apiName, type)
          break;
        case "picture" :
          this.inputLabelsFormatted[apiName].isValidatedData = true
          break;
        case "phoneNumber" :
          regex = /^[0-9]{10}$/
          this.setValidatedData(value, regex, apiName, type)
          break;
        case "email" :
          regex = /^[a-z0-9._\-]{2,30}@[a-z0-9]{2,30}\.[a-z]{2,4}$/
          this.setValidatedData(value, regex, apiName, type)
          break;
        case "password" :
          this.samePasswords = false
          if (this.inputLabelsFormatted[apiName].value === this.inputLabelsFormatted["passwordConfirmation"]?.value) this.samePasswords = true
          regex = /^((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%?=*&]).{8,20})$/
          this.setValidatedData(value, regex, apiName, type, this.samePasswords)
          break;
        case "passwordConfirmation" :
          this.samePasswords = false
          if (this.inputLabelsFormatted[apiName].value === this.inputLabelsFormatted["password"].value && this.inputLabelsFormatted[apiName].value.length !== 0 && this.inputLabelsFormatted["password"].value.length !== 0) this.samePasswords = true
          this.setValidatedData(value, regex, apiName, type, this.samePasswords)
          break;
      }
    },
    setValidatedData(value, regex, apiName, type, samePasswords) {
      this.firstDisplay = false
      if (type !== "passwordConfirmation") this.isFound = Boolean(value.match(regex))

      if (this.isFound) {
        this.inputLabelsFormatted[apiName].isValidatedData = true;
        if (type === "password" && !samePasswords && this.isRegistration) this.inputLabelsFormatted["passwordConfirmation"].isValidatedData = false
        else if (type === "password" && samePasswords) this.inputLabelsFormatted["passwordConfirmation"].isValidatedData = true
      } else if (samePasswords) {
        this.inputLabelsFormatted["passwordConfirmation"].isValidatedData = true
      } else if (type === "password") {
        if (this.inputLabelsFormatted["passwordConfirmation"]?.isValidatedData) this.inputLabelsFormatted["passwordConfirmation"].isValidatedData = false
        this.inputLabelsFormatted[apiName].isValidatedData = false
      } else {
        this.inputLabelsFormatted[apiName].isValidatedData = false
      }
    },
    initializeForm() {
      this.inputLabelsAndApiName.forEach((element) => {
        this.$set(this.inputLabelsFormatted, element.apiName, {
          value: "",
          isValidatedData: false,
          errorMessage: element.errorMessage
        })
      })
      console.log(this.inputLabelsFormatted)
      this.firstDisplay = true
    },
    async add() {
      this.isLoading = true
      try {
        if (this.elementToAddInDb === 'product') {
          if (this.inputLabelsFormatted.picture) await this.uploadPicture()
          const name = this.inputLabelsFormatted.name.value
          const price = this.inputLabelsFormatted.price.value
          const stock_quantity = this.inputLabelsFormatted.stock_quantity.value
          const serial_number = this.inputLabelsFormatted.serial_number.value
          const picture = this.firebaseUrl
          const user_id = localStorage.getItem("userId")

          const product = {name, price, serial_number, stock_quantity, picture, user_id}

          let response
          try {
            response = await this.$store.state.axiosBaseUrl.post('/devices', product, {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem("token")
              }
            })
            this.$store.commit('addProduct', {...response.data.deviceCreated})
            this.isError = false
          } catch(e) {
            console.error(e)
            this.isError = true
            if(e.response.status === 401) await this.$router.replace({path: '/'})
          }

        } else if (this.elementToAddInDb === 'customer') {
          const company_name = this.inputLabelsFormatted.company_name.value
          const siret = this.inputLabelsFormatted.siret.value
          const phone_number = this.inputLabelsFormatted.phone_number.value
          const user_id = localStorage.getItem("userId")

          const customer = {company_name, siret, phone_number, user_id}

          let response;
          try {
            response = await this.$store.state.axiosBaseUrl.post('/customers', customer, {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem("token")
              }
            })
            this.$store.commit('addCustomer', {...response.data.customerCreated})
            this.isError = false
          } catch(e) {
            console.error(e)
            this.isError = true
            if(e.response.status === 401) await this.$router.replace({path: '/'})
          }

        } else if (this.elementToAddInDb === 'user' || this.elementToAddInDb === 'userConnection') {


          const email = this.inputLabelsFormatted.email.value
          const password = this.inputLabelsFormatted.password.value
          const pseudo = this.inputLabelsFormatted.pseudo?.value

          const user = this.elementToAddInDb === 'user' ? {email, password, pseudo} : {email, password}

          const url = this.elementToAddInDb === 'user' ? '/signup' : '/login'

          let response;

          try {
            response = await this.$store.state.axiosBaseUrl.post(url, user, {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem("token")
              }
            })

            this.$store.commit('setUserPseudo', response.data.user.pseudo)
            localStorage.setItem('token', response.data.token)
            localStorage.setItem('userId', response.data.user.userId.toString())
            if(response.data.user) await this.$router.replace({path: '/products'})
          } catch(e) {
            console.error(e)
            this.displayConnectionErrorMessage = true
            if(e.response.status === 401) {
              this.connectionOrRegistrationError = e.response.data.message
            } else if (e.response.status === 400) {
                this.connectionOrRegistrationError = e.response.data
            }
          }
        }
        this.isLoading = false

        if(this.elementToAddInDb !== 'userConnection' && this.elementToAddInDb !== 'user') {
          this.displayConfirmation = true
          this.dialog = false
        }

      } catch (e) {
        console.error(e)
      }
    },
    previewAddedPicture(picture) {
      this.imageData = picture
      const reader = new FileReader()
      reader.addEventListener('load', e => this.previewPicture = e.target.result)
      if (picture) reader.readAsDataURL(picture)
    },
    async uploadPicture() {
      this.firebaseUrl = null
      const storageRef = firebase.storage().ref(`devices/images/${this.imageData.name}`).put(this.imageData)

      //TODO : loader with this code
      storageRef.on(`state_changed`, snapshot => {
        this.uploadValue = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      }, error => {
        console.log(error.message)
      })
      this.uploadValue = 100

      this.firebaseUrl = await storageRef.snapshot.ref.getDownloadURL()
    }
  },
  beforeMount() {
    this.initializeForm()
    if (this.isRegistration || this.isConnection) {
      this.dialog = true
      this.$store.commit("deleteUserPseudo")
    }
  },



}
</script>

<style scoped>
.popinButtons {
  color: #6750A4;
}

.popinButtons:hover {
  cursor: pointer;
}

.v-card__title {
  justify-content: center;
  font-weight: bold;
}

.headerIcon {
  display: flex;
  justify-content: center;
}

.previewPictureCss {
  display: flex;
  justify-content: center;
}

</style>
