<template>
    <div>
        <v-navigation-drawer
        v-model="drawer"
        app
        id="menu"
        temporary
        >
            <v-icon @click.stop="drawer = !drawer" id="close-menu">mdi-close</v-icon>
            <v-list dense>
                <v-list-item link to="/pedido">
                    <v-list-item-action>
                        <v-icon>mdi-cart-arrow-down</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>Configurar pedido</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item link to="/pedidos-anteriores">
                    <v-list-item-action>
                        <v-icon>mdi-history</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>Pedidos anteriores</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item link :href="web" target="_blank">
                    <v-list-item-action>
                        <v-icon>mdi-open-in-new</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>Visita nuestra web</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>
        <v-app-bar
            app
            light
            >
            <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
            
            <div class="d-flex align-center">
                <!-- <v-img
                alt="Vuetify Logo"
                class="shrink mr-2"
                contain
                src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
                transition="scale-transition"
                width="40"
                /> -->

                <v-img
                alt="Ecosecha"
                contain
                min-width="200"
                src="../../assets/ecosecha.png"
                width="200" v-if="!guerta"
                />
                <v-img
                alt="Güerta"
                contain
                min-width="200"
                src="../../assets/guerta.png"
                width="200" v-if="guerta"
                />
            </div>
            <div id="logout-wrapper">
                <v-btn class="grey white--text" v-on:click="logout"><v-icon>mdi-logout</v-icon> Salir</v-btn>
            </div>
        </v-app-bar>
    </div>
    
</template>
<script>
  export default {
    props: {
      source: String,
      guerta: Boolean,
      web: String
    }, 
    data: () => ({
      drawer: false,
    }),
    methods:{
        logout: function () {
            delete localStorage.token;
            this.$emit('logOut');
            this.$router.push('/');
        }
    }
  }
</script>

<style lang="scss">
  @import '@/styles/_variables.scss';
  #menu{
      padding-top: 65px;
      #close-menu{
            position: absolute;
            top: 20px;
            right: 20px;
            color: $error-color;
            transition: all 0.5s ease-in-out;
            font-size: 30px;
            &:hover{
                transform: rotate(180deg);
            }
      }
  }
  header.v-app-bar{
    box-shadow: none;      
    border-bottom: 1px solid rgba(0,0,0,0.14) !important;
    background-color: #FFF !important;
  }
</style>