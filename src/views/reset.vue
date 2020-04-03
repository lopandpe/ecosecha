<template>
  <div class="login-wrapper border border-light">
    <form class="form-signin" @submit.prevent="reset">
      <div class="form-inner" v-if="!this.mensaje">
        <h2 class="form-signin-heading">Resetear contraseña</h2>
        <div class="alert alert-danger" v-if="error">{{ error }}</div>
        <label for="usuario" class="sr-only">Introduce tu usuario</label>
        <input v-model="usuario" type="text" id="usuario" class="form-control" placeholder="XXX" required autofocus>
        <label for="password" class="sr-only">Introduce tu contraseña temporal</label>
        <input v-model="password" type="password" id="password" class="form-control" placeholder="********" required >
        <label for="nuevaPassword" class="sr-only">Introduce tu nueva contraseña</label>
        <input v-model="nuevaPassword" type="password" id="nuevaPassword" class="form-control" placeholder="********" required>
        <input class="btn btn-lg btn-primary btn-block" type="submit" value="Enviar">
      </div>
      <div class="alert alert-success" v-if="mensaje">{{ mensaje }}</div>
      <router-link :to="{name: 'Login'}">Volver</router-link>
    </form>
  </div>
</template>

<script>
// const axios = require('axios');
export default {
  name: 'Reset',
  data () {
    return {
      usuario: '',
      password: '',
      nuevaPassword: '',
      mensaje: '',
      error: null
    }
  },
  methods: {
    checkCurrentLogin () {
      if (localStorage.token) {
        if(this.$route.query.redirect){
          this.$router.replace(this.$route.query.redirect)
        }else{
          this.$router.push({ name: 'Pedido' })
        }
      }
    },
    reset () { 
      let pattern = /^(\S){8,16}/;
      if(!pattern.test(this.nuevaPassword)){
        this.error = "La nueva contraseña debe tener como mínimo 8 caracteres, máximo 16. Sin espacios.";
        return false;
      }
      this.$http.post('/nuevopassword', {  
        token: '',
        usuario: this.usuario,
        password: this.password,
        passwordNuevo: this.nuevaPassword
      } ).then(
          request => this.resetSuccessful(request)
        ).catch(
          error => this.resetFailed(error)
        )
    },
    resetSuccessful () {
      this.mensaje = '¡Contraseña modificada! Vuelve a la pantalla de entrada y accede con tus nuevos datos.'
    },
    resetFailed (error) {
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