<template>
  <div class="login-wrapper border border-light">
    <form class="form-signin" @submit.prevent="remember">
      <div class="form-inner" v-if="!this.mensaje">
        <h2 class="form-signin-heading">Recordar contraseña</h2>
        <div class="alert alert-danger" v-if="error">{{ error }}</div>
        <label for="usuario" class="sr-only">Introduce tu usuario</label>
        <input v-model="usuario" type="text" id="usuario" class="form-control" placeholder="XXX" required autofocus>
        <label for="mail" class="sr-only">Introduce tu correo electrónico</label>
        <input v-model="email" type="email" id="email" class="form-control" placeholder="correo@electronico.com" required>
        <button class="btn btn-lg btn-primary btn-block" type="submit">Enviar</button>
      </div>
      <div class="alert alert-success" v-if="mensaje">{{ mensaje }}</div>      
      <router-link :to="{name: 'Login'}">Volver</router-link>
    </form>
  </div>
</template>

<script>
// const axios = require('axios');
export default {
  name: 'Remember',
  data () {
    return {
      email: '',
      usuario: '',
      mensaje: '',
      error: null
    }
  },
  methods: {
    checkCurrentLogin () {
      if (localStorage.token) {
        this.$router.replace(this.$route.query.redirect || '/pedido')
      }
    },
    remember () { 
      this.$http.post('/recordarpassword', { 
        cuentaCorreo: this.email,
        token: '',
        usuario: this.usuario,
      } ).then(
          request => this.rememberSuccessful(request)
        ).catch(
          error => this.loginFailed(error)
        )
    },
    rememberSuccessful () {
      this.error = '';
      this.mensaje = 'Revisa tu bandeja de entrada. Te hemos enviado una contraseña temporal.'
    },
    loginFailed (error) {
      console.log(error.response.data.mensaje);
      if('mensaje' in error.response.data)
        this.error = error.response.data.mensaje;
      else
        this.error = error;
    }
  },
  mounted (){
    this.checkCurrentLogin ();
  }
}
</script>

<style lang="css">
/* body {
  background: #605B56;
}

.login-wrapper {
  background: #fff;
  width: 70%;
  margin: 12% auto;
}

.form-signin {
  max-width: 330px;
  padding: 10% 15px;
  margin: 0 auto;
}
.form-signin .form-signin-heading,
.form-signin .checkbox {
  margin-bottom: 10px;
}
.form-signin .checkbox {
  font-weight: normal;
}
.form-signin .form-control {
  position: relative;
  height: auto;
  -webkit-box-sizing: border-box;
          box-sizing: border-box;
  padding: 10px;
  font-size: 16px;
}
.form-signin .form-control:focus {
  z-index: 2;
}
.form-signin input[type="text"] {
  margin-bottom: -1px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}
.form-signin input[type="password"] {
  margin-bottom: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
} */
</style>