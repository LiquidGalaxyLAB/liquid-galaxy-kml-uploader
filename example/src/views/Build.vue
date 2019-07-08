<template lang="html">
  <v-container wrap row>

    <v-btn color="success" lg12>NEW KML</v-btn>
    <v-container>
      Add Placemark
      <v-layout align-center justify-space around row fill-height>
        <v-flex md2>
          <v-text-field label="Latitude" placeholder="Placeholder"></v-text-field>
        </v-flex>
        <v-flex md2>
          <v-text-field label="Longitude" placeholder="Placeholder"></v-text-field>
        </v-flex>
        <v-flex md2>
          <v-text-field label="Altitude" placeholder="Placeholder"> </v-text-field>
        </v-flex>
      </v-layout>
    </v-container>
  </v-container>
</template>

<script>
export default {
}
</script>

<style lang="css" scoped>
</style>
