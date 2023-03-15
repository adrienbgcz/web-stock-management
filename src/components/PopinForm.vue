<template>
  <v-row justify="center">
    <v-dialog
        v-model="dialog"
        persistent
        width="50%"
    >
      <template v-slot:activator="{ props }">
        <FloatingButton v-bind="props" @openForm="dialog=true" :content="'+'"/>
      </template>
      <v-card>
        <v-card-title>
          <span class="text-h6 text-center">Ajouter un produit</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row v-for="inputLabel in inputLabelsAndApiNameComputed" :key="inputLabel.apiName">
              <v-col cols="12">
                <v-text-field
                    :label="inputLabel.label + ' *'"
                    :placeholder="inputLabel.label"
                    :error="isError(inputLabel.apiName)"
                    outlined
                    required
                    v-model="dataFormatted[inputLabel.apiName].value"
                    @input="validInput(inputLabel.type, inputLabelsFormatted[inputLabel.apiName].value, inputLabel.apiName, inputLabel.label)"

                ></v-text-field>
<!--                @input="validInput(inputLabel.type, inputLabelsFormatted[inputLabel.apiName])"-->
              </v-col>
            </v-row>
<!--            {{errorsComputed.length}}-->
<!--            <div v-if="errorsComputed.length !== 0">
              {{this.errorsComputed}}
            </div>-->
          </v-container>
          <small>* Obligatoire</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
              color="white"
              variant="text"
              elevation="0"
              @click="dialog = false"
          >
            <span class="popinButtons">Annuler</span>
          </v-btn>
          <v-btn
              color="white"
              variant="text"
              elevation="0"
              @click="dialog = false"
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

export default {
  components: {FloatingButton},
  data: () => ({
    dialog: false,
    inputLabelsFormatted: {},
    isValidatedDataForm: false,
    isFound: false,
    errors: []
  }),
  props: {
    inputLabelsAndApiName: {
      type: Array,
      required: true
    }
  },
  computed: {
    numberOfInputs() {
      this.inputLabelsAndApiName.length
    },
    dataFormatted() {
      this.inputLabelsAndApiName.forEach((element) => {
        this.inputLabelsFormatted[element.apiName] = {
          value: "",
          isValidatedData: false
        }
      })
      console.log("DATA FORMATTED - INPUT LABEL FORMATTED", this.inputLabelsFormatted)
      return this.inputLabelsFormatted
    },
    inputLabelsAndApiNameComputed() {
      return this.inputLabelsAndApiName
    },
    errorsComputed() {
      return this.errors
    },
    isError(apiName) {
      return this.inputLabelsFormatted[apiName] ? !this.inputLabelsFormatted[apiName].isValidatedData : true
    }
  },
  methods: {
    /*formatPayload(apiName) {
      console.log(this.inputLabelsFormatted)
    },*/
    validInput(type, value, apiName, label) {
      console.log("TYPE", type)
      console.log("VALUE", value)
      console.log("FIELD", apiName)
      console.log(this.dataFormatted)

      let regex = ""
      this.isFound = false
      switch(type) {
        case "string" :
          regex=/^[a-zA-Zéèàêïî]{2,20}$/
          this.setValidatedData(value, regex, apiName, label, type)
          break;
        case "number" :
          regex=/^[0-9]{1,4}$/
          this.setValidatedData(value, regex, apiName, label, type)
          break;
      }
    },
    setValidatedData(value, regex, apiName, label, type) {
      this.isFound = value.match(regex)
      if(this.isFound != null) {
        this.inputLabelsFormatted[apiName].isValidatedData = true
        /*if(type === 'string') {
          this.errors.push(`${label} must contain between 2 and 20 characters and only letters. \n`)
        } else if(type === 'number') {
          this.errors.push(`${label} must contain only numbers. \n`)
        }*/
      } else {
        this.inputLabelsFormatted[apiName].isValidatedData = false
      }

    },
    /*isError(apiName) {
      return this.inputLabelsFormatted[apiName] ? !this.inputLabelsFormatted[apiName].isValidatedData : true
    }*/

  },
  mounted() {
    console.log("INPUT LABEL AND API NAME", this.inputLabelsAndApiName)
    /*this.inputLabelsAndApiName.forEach((element, index) => {
      /!*const apiName = this.inputLabelsAndApiName[index].apiName*!/
      this.inputLabelsFormatted[element.apiName] = {
        value: "",
        isValidatedData: false
      }
    })*/
    /*console.log("INPUT LABEL FORMATTED MOUNTED",this.inputLabelsFormatted)*/
  }
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


</style>
