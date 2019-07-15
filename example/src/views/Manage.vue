<template id="">
    <v-container>
      <v-layout align-center justify-center row fill-height>
        <v-flex md6 lg6>
        New KMLf fdsf
        </v-flex>
        <v-flex md3 lg3>
          <v-text-field
            label="Regular"
          ></v-text-field>
        </v-flex>
        <v-flex md3 lg3>
          <v-btn @onclick="newKml()">
            Create
          </v-btn>
        </v-flex>
      </v-layout>
    </v-container>

</template>


<script type="text/javascript">
export default {
  methods:{
    newKml(){
      console.log("hello")
    }
  }
}





</script>


<style media="screen">

</style>
