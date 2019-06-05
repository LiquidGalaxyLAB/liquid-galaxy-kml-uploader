<template>
  <v-container>
    <v-layout row align-center justify-center  fill-height>
      <h1>KML</h1>

    </v-layout>
    <v-layout row align-center justify-center  fill-height>
      <Options />

    </v-layout>
  </v-container>
</template>

<script>
  import Options from '../components/Options'
  export default {
    components: {
      Options
    }
  }
</script>
