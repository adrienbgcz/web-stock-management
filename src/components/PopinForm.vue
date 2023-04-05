<template>
  <v-row justify="center">
    <v-dialog
        v-model="dialog"
        persistent
        :width="!$vuetify.breakpoint.xs ? '50%' : '80%'"
    >
      <template v-slot:activator="{ props }" v-if="!isRegistration">
        <FloatingButton v-bind="props" @openForm="dialog=true" :content="'+'"/>
      </template>
      <v-card>
        <div class="headerIcon pt-6">
          <v-icon x-large color="#6750A4">{{ icon }}</v-icon>
        </div>

        <v-card-title>
          <span class="text-h6 text-center">{{ title }}</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <div v-if="imageData!=null" class="previewPictureCss">
              <img v-if="previewPicture" class="preview mb-3" height="268" width="356" :src="previewPicture">
            </div>
            <v-row v-for="inputLabel in inputLabelsAndApiName" :key="inputLabel.apiName">
              <v-col cols="12">
                <v-file-input v-if="inputLabel.type === 'picture'"
                              :rules="rules"
                              accept="image/png, image/jpeg, image/bmp"
                              placeholder="Ajouter une image"
                              prepend-icon="mdi-camera"
                              label="Ajouter une image"
                              @change="validInput(inputLabel.type, inputLabelsFormatted[inputLabel.apiName].value, inputLabel.apiName, inputLabel.label); previewAddedPicture($event)"
                ></v-file-input>
                <v-text-field v-else
                              :label="inputLabel.label + ' *'"
                              :placeholder="inputLabel.label"
                              :error-messages="firstDisplay ? '' : inputLabelsFormatted[inputLabel.apiName] ? !inputLabelsFormatted[inputLabel.apiName].isValidatedData ? inputLabelsFormatted[inputLabel.apiName].errorMessage : '' : ''"
                              outlined
                              required
                              v-model="inputLabelsFormatted[inputLabel.apiName].value"
                              @input="validInput(inputLabel.type, inputLabelsFormatted[inputLabel.apiName].value, inputLabel.apiName, inputLabel.label)"
                ></v-text-field>
              </v-col>
            </v-row>
            <ConfirmationPopin :is-display="displayConfirmationComputed"
                               @close="displayConfirmation=false" :message="confirmationMessage"/>
          </v-container>
          <small>* Obligatoire</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
              v-if="!isRegistration"
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

          <v-btn
              color="white"
              variant="text"
              elevation="0"
              :disabled="manageValidateButton"
              @click="dialog = false; add()"
          >
            <span class="popinButtons">Valider</span>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import FloatingButton from "@/components/FloatingButton";
import ConfirmationPopin from "@/components/ConfirmationPopin";
import firebase from "firebase/compat";

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
    samePasswords: false
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
    isRegistration: {
      type: Boolean,
      default: false
    },
    isInscription: {
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
    }
  },
  methods: {
    validInput(type, value, apiName, label) {
      let regex = ""
      this.isFound = false

      switch (type) {
        case "lengthLettersNumbers" :
          regex = /^[a-zA-Z0-9éèàêïî]{2,20}$/
          this.setValidatedData(value, regex, apiName, label, type)
          break;
        case "number" :
          regex = /^[0-9]{1,4}$/
          this.setValidatedData(value, regex, apiName, label, type)
          break;
        case "picture" :
          this.inputLabelsFormatted[apiName].isValidatedData = true
          break;
        case "phoneNumber" :
          regex = /^[0-9]{10}$/
          this.setValidatedData(value, regex, apiName, label, type)
        case "email" :
          regex = /^[a-z0-9._\-]{2,30}@[a-z0-9]{2,30}\.[a-z]{2,4}$/
          this.setValidatedData(value, regex, apiName, label, type)
          break;
        case "password" :
          this.samePasswords = false
          if (this.inputLabelsFormatted[apiName].value === this.inputLabelsFormatted["passwordConfirmation"].value) this.samePasswords = true
          console.log(this.samePasswords)
          regex = /^((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%?=*&]).{8,20})$/
          this.setValidatedData(value, regex, apiName, label, type, this.samePasswords)
          break;
        case "passwordConfirmation" :
          this.samePasswords = false
          console.log(this.inputLabelsFormatted[apiName].value)
          if (this.inputLabelsFormatted[apiName].value === this.inputLabelsFormatted["password"].value && this.inputLabelsFormatted[apiName].value.length !== 0 && this.inputLabelsFormatted["password"].value.length !== 0) this.samePasswords = true
          console.log(this.samePasswords)
          this.setValidatedData(value, regex, apiName, label, type, this.samePasswords)
          break;
      }
    },
    setValidatedData(value, regex, apiName, label, type, samePasswords) {
      this.firstDisplay = false
      if (type !== "passwordConfirmation") this.isFound = Boolean(value.match(regex))

      if (this.isFound) {
        this.inputLabelsFormatted[apiName].isValidatedData = true;
        if (type === "password" && !samePasswords) this.inputLabelsFormatted["passwordConfirmation"].isValidatedData = false
        else if (type === "password" && samePasswords) this.inputLabelsFormatted["passwordConfirmation"].isValidatedData = true
      } else if (samePasswords) {
        this.inputLabelsFormatted["passwordConfirmation"].isValidatedData = true
      } else if (type === "password") {
        this.inputLabelsFormatted["passwordConfirmation"].isValidatedData = false
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
      this.firstDisplay = true
    },
    async add() {
      try {
        if (this.elementToAddInDb === 'product') {
          if (this.inputLabelsFormatted.picture) await this.uploadPicture()
          const name = this.inputLabelsFormatted.name.value
          const price = this.inputLabelsFormatted.price.value
          const stock_quantity = this.inputLabelsFormatted.stock_quantity.value
          const serial_number = this.inputLabelsFormatted.serial_number.value
          const picture = this.firebaseUrl

          const product = {name, price, serial_number, stock_quantity, picture}

          await this.$store.state.axiosBaseUrl.post('/devices', product, {
            headers: {
              'Content-Type': 'application/json'
            }
          })
        } else if (this.elementToAddInDb === 'customer') {
          const company_name = this.inputLabelsFormatted.company_name.value
          const siret = this.inputLabelsFormatted.siret.value
          const phone_number = this.inputLabelsFormatted.phone_number.value

          const customer = {company_name, siret, phone_number}

          await this.$store.state.axiosBaseUrl.post('/customers', customer, {
            headers: {
              'Content-Type': 'application/json'
            }
          })
        } else if (this.elementToAddInDb === 'user') {
          const email = this.inputLabelsFormatted.email.value
          const password = this.inputLabelsFormatted.password.value

          const user = {email, password}

          await this.$store.state.axiosBaseUrl.post('/users', user, {
            headers: {
              'Content-Type': 'application/json'
            }
          })
        }
        this.displayConfirmation = true

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
    },
  },
  beforeMount() {
    this.initializeForm()
    if (this.isRegistration) this.dialog = true;
  },

}
</script>

<style scoped>
.popinButtons {
  color: #6750A4;
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
