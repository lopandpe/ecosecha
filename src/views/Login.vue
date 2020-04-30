<template>
  <div class="login-wrapper border border-light">
    <form class="form-signin" @submit.prevent="login">
      <h2 class="form-signin-heading">Acceder a la plataforma</h2>
      <div class="alert alert-danger" v-if="error">{{ error }}</div>
      <label for="inputUser" class="sr-only">Usuario</label>
      <input v-model="user" type="text" id="inputUser" class="form-control" placeholder="Nombre de usuario" required autofocus>
      <label for="inputPassword" class="sr-only">Password</label>
      <input v-model="password" type="password" id="inputPassword" class="form-control" placeholder="Password" required>
      <button class="btn btn-lg btn-primary btn-block bg-primary" type="submit">Entrar</button>
      <router-link :to="{name: 'Remember'}">Olvidé mi contraseña</router-link>
    </form>
  </div>
</template>

<script>
// const axios = require('axios');
// import jwt_decode from 'jwt-decode';

export default {
  name: 'Login',
  data () {
    return {
      user: '',
      password: '',
      error: false,
    }
  },
  methods: {
    checkCurrentLogin () {
      if (localStorage.token) {
        this.$router.replace(this.$route.query.redirect || '/pedido')
      }
    },
    login () { 
      this.$http.post('/loginuser', { 
        usuario: this.user, 
        password: this.password 
      } ).then(
          request => this.loginSuccessful(request)
        ).catch(
          error => this.loginFailed(error)
        )
    },
    loginSuccessful (req) {
      


      if('mensaje' in req.data &&  req.data.mensaje == 'Reset Password'){
        this.$router.replace(this.$route.query.redirect || '/resetpassword');
        return;
      }
      if (!req.data.JWT) {
        this.loginFailed(req)
        return
      }

      // let tokenDecoded = jwt_decode(req.data.JWT);
      // console.log(tokenDecoded);

      localStorage.token = req.data.JWT
      this.error = false
      
      this.$router.replace(this.$route.query.redirect || '/pedido')
    },
    loginFailed (error, mensaje = 'Por favor, comprueba que los datos introducidos son correctos.') {
      if('mensaje'in error.response.data){
        mensaje = error.response.data.mensaje;
      }
      this.error = mensaje;
      delete localStorage.token
    }
  },
  mounted (){
    this.checkCurrentLogin ();
  }
}
</script>
 
<style lang="scss">
  @import '@/styles/_variables.scss';
</style>