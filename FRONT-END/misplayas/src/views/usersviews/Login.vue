<template>
  <div>
    <vue-headful title="Misplayas | Login" />
    <h1>Login de usuario</h1>

    <p>
      <input v-model="email" type="email" required placeholder="Email" />
    </p>

    <p>
      <input v-model="password" type="password" required placeholder="Contraseña" />
    </p>

    <p v-show="error">{{message}}</p>

    <button @click="loginUser()">Entrar</button>

    <p>
      Si has olvidado tu contraseña.
      <button @click="sendRecoverPassword">Pincha aquí</button>
    </p>
    <div v-show="recover">
      <p>{{messageBefore}}</p>
      <input v-model="recoverCode" type="text" required placeholder="Código de recuperación" />
      <input v-model="newPassword" type="password" required placeholder="Nueva contraseña" />
      <button @click="resetPassword">Enviar</button>
    </div>
    <p>{{messageAfter}}</p>

    <spinner v-show="spinner" />
  </div>
</template>

<script>
import axios from "axios";
import { login } from "../../api/utils";
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
      message: "",
      recover: false,
      recoverCode: "",
      newPassword: "",
      messageAfter: "",
      messageBefore: "",
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
          this.$router.push("/user");
          setTimeout(() => {
            location.reload();
          }, 1000);
          //this.window.history.back();
        } catch (error) {
          //this.spinner = false
          this.error = true;
          console.log(error);
          this.message = error.response.data.message;
        }
        //ver vídeo tutoría Berto
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
        this.messageBefore = response.data.message;
        this.recover = true;
      } catch (error) {
        console.log(error);
      }
    },

    //FUNCIÓN PARA PROCESAR CÓDIGO DE RECUPERACIÓN DE CONTRASEÑA
    ///beach/users/reset-password",resetUserPassword
    async resetPassword() {
      try {
        const response = await axios.post(
          "http://localhost:3000/beach/users/reset-password",
          { recoverCode: this.recoverCode, newPassword: this.newPassword }
        );
        this.messageAfter = response.data.message;
        this.recoverCode = "";
        this.newPassword = "";
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style>
</style>