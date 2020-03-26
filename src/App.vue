<template>
  <v-app id="inspire">
    <!-- <Nav /> -->
    <Menu v-if="logged"/>
    <v-content>
      <router-view/>
    </v-content>
    <div id="loader" v-bind:class="{ active: loader }">
      <div class="centered">
        <svg version="1.1" id="rabano" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
          viewBox="0 0 149.1 145.1" style="enable-background:new 0 0 149.1 145.1;" xml:space="preserve">
        <path id="XMLID_25_" class="st0" d="M37.1,91.1l-8.5-8.5c0,0-0.7-0.7-0.8-0.7c-1.8,1.2-2.5,1.3-3.9,2.6l9.8,9.8
          c0.5,0.5,1.1,0.7,1.6,0.7c0.6,0,1.2-0.2,1.6-0.7C38,93.4,38,92,37.1,91.1z"/>
        <path id="XMLID_152_" class="st1" d="M128.6,59.4c-0.2-0.1-0.4-0.2-0.7-0.3c-0.1-0.1-0.2-0.1-0.3-0.2c-0.9-0.5-6.1-3.1-18.2-1.9
          c-10.1,1-19.9,4.1-28.7,9.1c4.9-8.8,8.1-18.5,9.1-28.7c1.2-12.1-1.3-17.3-1.9-18.2c-0.1-0.1-0.1-0.2-0.2-0.3
          c-0.1-0.2-0.2-0.5-0.3-0.7c-1.7-3.1-4.5-5.4-8-6.4c-3.4-1-7-0.6-10.2,1.1C63.6,16,61,22.8,63,28.8c-3.8,3.2-5.5,8.4-4.3,13.3
          c0.3,1,0.6,2,1.1,2.9c-1.5,1.5-2.7,3.5-3.3,5.6c-1,3.4-0.6,7,1.1,10.2c0.9,1.6,2,3,3.5,4.1l-2.6,11.6c5.9,3.5,7.4,6,11.5,11.6
          c0.3-0.1,11.9-2.4,11.9-2.4c1.1,1.4,2.5,2.6,4.1,3.5c2,1.1,4.2,1.6,6.4,1.6c1.3,0,2.6-0.2,3.8-0.6c2.1-0.6,4.1-1.8,5.6-3.3
          c0.9,0.5,1.9,0.9,2.9,1.1c4.9,1.2,10.1-0.5,13.3-4.3c6,2,12.8-0.5,15.9-6.3C137.5,71.1,135.1,62.9,128.6,59.4z M67.5,71.8l1.7-7.9
          c0.4-1.8-0.5-3.6-2.2-4.3c-1.1-0.5-2-1.3-2.6-2.4c-0.7-1.3-0.9-2.8-0.4-4.3c0.4-1.4,1.4-2.6,2.7-3.3l0.3-0.1c1.2-0.6,2-1.6,2.2-2.9
          c0.2-1.3-0.3-2.6-1.2-3.4c-0.8-0.8-1.4-1.7-1.6-2.8c-0.5-2.1,0.3-4.5,2-5.8c0.4-0.3,0.8-0.5,1.3-0.7c1.1-0.5,1.9-1.4,2.2-2.5
          c0.3-1.1,0.1-2.4-0.6-3.3c-0.2-0.3-0.3-0.5-0.4-0.6c-1.5-2.7-0.5-6.1,2.3-7.6c0.8-0.5,1.7-0.7,2.7-0.7c0.5,0,1.1,0.1,1.6,0.2
          c1.4,0.4,2.6,1.4,3.3,2.7c0.1,0.2,0.2,0.4,0.3,0.7c0.1,0.3,0.3,0.6,0.5,0.9c0.5,1.3,1.5,5.4,0.7,13.2C80.9,49.5,75.8,61.7,67.5,71.8
          z M127.2,73.8c-1.5,2.7-4.9,3.7-7.6,2.3c-0.2-0.1-0.4-0.2-0.6-0.4c-1-0.7-2.2-0.9-3.3-0.6c-1.1,0.3-2.1,1.1-2.5,2.2
          c-0.2,0.4-0.4,0.9-0.7,1.3c-1.3,1.7-3.6,2.5-5.8,2c-1.1-0.3-2-0.8-2.8-1.6c-0.9-0.9-2.2-1.4-3.4-1.2c-1.3,0.2-2.4,1-2.9,2.2
          l-0.1,0.3c-0.7,1.3-1.9,2.3-3.3,2.7c-1.4,0.4-2.9,0.3-4.3-0.4c-1.1-0.6-1.9-1.5-2.4-2.6c-0.6-1.4-2-2.3-3.5-2.3
          c-0.3,0-0.5,0-0.8,0.1L75,79.3c10.1-8.2,22.3-13.3,35.2-14.6c7.8-0.8,11.8,0.3,13.2,0.7c0.3,0.2,0.5,0.3,0.9,0.5
          c0.3,0.1,0.5,0.2,0.7,0.3c1.3,0.7,2.3,1.9,2.7,3.3C128.1,71,127.9,72.5,127.2,73.8z"/>
        <path id="XMLID_154_" class="st0" d="M28.3,109.3c0.6,0,1.2-0.2,1.6-0.7c0.9-0.9,0.9-2.4,0-3.3L17.7,93c-0.5,2.5-0.5,1.7-1.2,5.3
          l10.1,10.3C27.1,109,27.7,109.3,28.3,109.3z"/>
        <path id="XMLID_151_" class="st0" d="M35.2,106c0.6,0,1.2-0.2,1.6-0.7c0.9-0.9,0.9-2.4,0-3.3L21.6,86.7c-1.1,1.2-1.9,1.8-2.9,3.7
          l15,15C34.1,105.8,34.6,106,35.2,106z"/>
        <path id="line" class="st2" d="M19.4,84.5c7.6-6,22.3-18.7,40.6-1.4s13.6,32.4,5.5,40.5s-16.5,12-29.6,7.3
          c-13.1-4.8-21.8,1.2-22.6,2.1s7.3-18.1,2-25.3S16.4,86.9,19.4,84.5z" stroke-width="7"/>
        </svg>
        <h3>Cargando...</h3>

      </div>

    </div>
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
      loader: false,
      logged: false,
    }),
    components: {
      Menu
    },
    methods: {
      checkUserCredentials(){
        if (!localStorage.token && this.$route.path !== '/') {
          this.$router.push('/?redirect=' + this.$route.path)
        }else if (localStorage.token){
          this.logged = true;
        }
      },
    },
    updated () {
      this.checkUserCredentials();
    },
    created () {
      this.checkUserCredentials();
      this.$http.interceptors.request.use((config) => {
        console.log(true);
        this.loader = true;
        return config;
      }, (error) => {
        console.log('error!');
        // trigger 'loading=false' event here
        return Promise.reject(error);
      });

      this.$http.interceptors.response.use((response) => {
        // trigger 'loading=false' event here
        this.loader = false;
        return response;
      }, (error) => {
        console.log('error2');
        // trigger 'loading=false' event here
        return Promise.reject(error);
      });
    }
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
  #loader{
    z-index: 99999;
    display: none;
    .centered{
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  h3{
    color: #FFF;
    text-align: center;
  }
    &.active{
      display: block;
      position: fixed;
      top: 0px;
      left: 0px;
      bottom: 0px;
      right: 0px;
      background-color: rgba(0,0,0, 0.9);
    }
  }
  #rabano{
    width: 100px;    
    .st0{
      fill:#EC1C24;
      }
    .st1{
      fill:#11AF04;
      }
    .st2{
      fill:none;
      stroke:#EC1C24;
    }
    #line{
      stroke-dasharray: 212;
      animation: dash 2s ease-in-out infinite;
    }
  }
  
  @keyframes dash {
    from {
      stroke-dashoffset: 0%;
    }
    to {
      stroke-dashoffset: 295%;
    }
  }
</style>