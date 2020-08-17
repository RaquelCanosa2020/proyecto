<template>
  <div class="login">
    <vue-headful title="Misplayas | Login" />
    <h1>Login de usuario</h1>

    <p>
      <input v-model="email" type="email" required placeholder="Email" />
    </p>

    <p>
      <input v-model="password" type="password" required placeholder="Contraseña" />
    </p>

    <button @click="loginUser()">Entrar</button>

    <p>
      Si has olvidado tu contraseña.
      <button @click="sendRecoverPassword">Pincha aquí</button>
    </p>
    <div v-show="recover">
      <input v-model="recoverCode" type="text" required placeholder="Código de recuperación" />
      <input v-model="newPassword" type="password" required placeholder="Nueva contraseña" />
      <button @click="resetPassword">Enviar</button>
    </div>

    <spinner v-show="spinner" />
  </div>
</template>

<script>
import axios from "axios";
import { login, sweetAlertOk, sweetAlertNotice } from "../../api/utils";
import spinner from "@/components/Spinner.vue";

export default {
  name: "Login",
  components: {
    spinner,
  },
  data() {
    return {
      email: "",
      password: "",
      spinner: false,
      error: false,

      recover: false,
      recoverCode: "",
      newPassword: "",
    };
  },
  methods: {
    //FUNCIÓN de LOGIN

    async loginUser() {
      if (this.email === "" || this.password === "") {
        alert("faltan datos");
      } else {
        try {
          this.spinner = true;
          await login(this.email, this.password);
          //this.spinner = true;
          //location.reload();

          //this.$router.go(-1);
          this.$router.push("/user");
          setTimeout(() => {
            location.reload();
          }, 500);
          //this.window.history.back();
        } catch (error) {
          //this.spinner = false
          this.error = true;
          // console.log(error);
          this.message = error.response.data.message;
        }
      }
      /*setTimeout(() => {
        location.reload();
      }, 1000);*/
    },
    //FUNCIÓN PARA ENVIAR EMAIL CÓDIGO DE RECUPERACIÓN DE CONSTRASEÑA
    //app.post("/beach/users/recover-password", recoverUserPassword);

    async sendRecoverPassword() {
      try {
        const response = await axios.post(
          "http://localhost:3000/beach/users/recover-password",
          { email: this.email }
        );
        console.log(response.data);
        sweetAlertOk(response.data.message);
        this.recover = true;
      } catch (error) {
        sweetAlertNotice(error.response.data.message);
      }
    },

    //FUNCIÓN PARA PROCESAR CÓDIGO DE RECUPERACIÓN DE CONTRASEÑA

    async resetPassword() {
      try {
        const response = await axios.post(
          "http://localhost:3000/beach/users/reset-password",
          { recoverCode: this.recoverCode, newPassword: this.newPassword }
        );
        sweetAlertOk(response.data.message);
      } catch (error) {
        sweetAlertNotice(error.response.data.message);
      }
    },
  },
};
</script>

<style>
div.login {
  height: 100vh;
}
</style>