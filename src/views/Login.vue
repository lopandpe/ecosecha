<template>
  <div class="login-wrapper border border-light">
    <form class="form-signin" @submit.prevent="login">
      <h2 class="form-signin-heading">Acceder a la plataforma</h2>
      <div class="alert alert-danger" v-if="error">{{ error }}</div>
      <label for="inputUser" class="sr-only">Usuario</label>
      <input v-model="user" type="text" id="inputUser" class="form-control" placeholder="Nombre de usuario" required autofocus>
      <label for="inputPassword" class="sr-only">Password</label>
      <input v-model="password" type="password" id="inputPassword" class="form-control" placeholder="Password" required>
      <button class="btn btn-lg btn-primary btn-block" type="submit">Entrar</button>
    </form>
  </div>
</template>

<script>
// const axios = require('axios');
export default {
  name: 'Login',
  data () {
    return {
      user: '',
      password: '',
      error: false
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
      console.log(req);
      if (!req.data.JWT) {
        this.loginFailed(req)
        return
      }

      localStorage.token = req.data.JWT
      this.error = false

      this.$router.replace(this.$route.query.redirect || '/pedido')
    },
    loginFailed (error) {
      console.log(error);
      this.error = 'Login failed!'
      delete localStorage.token
    }
  },
  mounted (){
    this.checkCurrentLogin ();
  }
}
</script>

<style lang="css">
body {
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
}
</style>