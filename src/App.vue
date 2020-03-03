<template>
  <v-app id="inspire">
    <!-- <Nav /> -->
    <Menu />
    <v-content>
      <router-view/>
    </v-content>
    <!-- <v-footer
      color="indigo"
      app
    >
      <span class="white--text">&copy; 2019</span>
    </v-footer> -->
  </v-app>
</template>


<script>
  import Menu from './components/partials/Menu.vue'; 
  export default {
    props: {
      source: String,
    },
    data: () => ({
      drawer: null,
    }),
    components: {
      Menu
    },
  }
</script>

<style lang="scss">
  @import '@/styles/_variables.scss';
  #inspire{
    font-family: $font-family;
    font-weight: 300;
  }
  #logout-wrapper{
    width: 100%;
    text-align: right;
  }
</style>