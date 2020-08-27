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
    <p v-show="error">{{message}}</p>

    <p>
      Si has olvidado tu contraseña.
      <button @click="sendRecoverPassword">Pincha aquí</button>
    </p>

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
      message: "",
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

          this.$emit("login");

          this.$router.go(-1);
          //this.$router.push("/user");

          //this.window.history.back();
        } catch (error) {
          this.error = true;
          this.spinner = false;

          this.message = error.response.data.message;
        }
      }
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
        this.email = "";
        this.password = "";
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