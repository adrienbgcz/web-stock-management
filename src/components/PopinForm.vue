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
            <v-row v-for="inputLabel in inputLabelsAndApiName" :key="inputLabel.apiName">
              <v-col cols="12">
                <v-text-field
                    :label="inputLabel.label + ' *'"
                    :placeholder="inputLabel.label"
                    :error="inputLabelsFormatted[inputLabel.apiName] ? !inputLabelsFormatted[inputLabel.apiName].isValidatedData : false"
                    outlined
                    required
                    v-model="inputLabelsFormatted[inputLabel.apiName].value"
                    @input="validInput(inputLabel.type, inputLabelsFormatted[inputLabel.apiName].value, inputLabel.apiName, inputLabel.label)"
                ></v-text-field>
              </v-col>
            </v-row>
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
    inputLabelsFormatted: {

    },
    isValidatedDataForm: false,
    isFound: false,
    errors: [],
  }),
  props: {
    inputLabelsAndApiName: {
      type: Array,
      required: true
    }
  },
  methods: {
    validInput(type, value, apiName, label) {
      console.log(this.inputLabelsFormatted)

      let regex = ""
      this.isFound = false

      switch(type) {
        case "string" :
          regex=/^[a-zA-Zéèàêïî]{2,20}$/
          this.setValidatedData(value, regex, apiName)
          break;
        case "number" :
          regex=/^[0-9]{1,4}$/
          this.setValidatedData(value, regex, apiName)
          break;
      }
    },
    setValidatedData(value, regex, apiName) {
      this.isFound = Boolean(value.match(regex))
      if(this.isFound) {
        this.inputLabelsFormatted[apiName].isValidatedData = true
      } else {
        this.inputLabelsFormatted[apiName].isValidatedData = false
      }
    },
  },
  beforeMount() {
    console.log("INPUT LABEL AND API NAME", this.inputLabelsFormatted)
    this.inputLabelsAndApiName.forEach((element) => {
      this.$set(this.inputLabelsFormatted, element.apiName, {value: "",isValidatedData: false})
    })
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
