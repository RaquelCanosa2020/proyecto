<template>
  <div class="login">
    <vue-headful title="Misplayas | Login" />
    <section id="left">
      <p></p>
    </section>
    <section id="right">
      <h1>Login de usuario</h1>

      <p>
        <input v-model="email" type="email" required placeholder="Email" />
      </p>

      <p>
        <input v-model="password" type="password" required placeholder="Contraseña" />
      </p>

      <button class="login" @click="loginUser()">Entrar</button>
      <p v-show="error">{{message}}</p>

      <p>
        Si has olvidado tu contraseña...
        <button
          class="login"
          @click="sendRecoverPassword"
        >Pincha aquí</button>
      </p>

      <spinner v-show="spinner" />
    </section>
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
      email: "rcanosa1@gmail.com",
      password: "12345678",
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
        } catch (error) {
          this.error = true;
          this.spinner = false;

          this.message = error.response.data.message;
        }
      }
    },
    //FUNCIÓN PARA ENVIAR EMAIL CÓDIGO DE RECUPERACIÓN DE CONSTRASEÑA

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

<style scoped>
div.login {
  display: flex;
  background-color: #ebecf1;
  min-height: 100vh;
}

section#right {
  width: 50%;
  margin: auto;
}
h1 {
  font-size: 1.5rem;
}

p {
  font-size: 0.5rem;
}
button.login {
  font-size: 0.5rem;
  width: 75px;
  height: 10px;
}
section#left {
  background-image: url("../../assets/neno.jpg");
  background-size: cover;
  background-position-x: -160px;
  width: 50%;
  height: 100vh;
}

input {
  width: 75px;
  height: 15px;
  font-size: 0.5rem;
}
@media (min-width: 700px) {
  section#left {
    background-position-x: -200px;
  }
  input {
    width: 150px;
    height: 35px;
    font-size: 1rem;
  }
  p {
    font-size: 1rem;
  }
  button.login {
    font-size: 1rem;
    width: 120px;
    height: 20px;
  }
}

@media (min-width: 1000px) {
  section#left {
    background-position-x: -200px;
  }
  input {
    width: 250px;
    height: 55px;
    font-size: 1.2rem;
  }
  h1 {
    font-size: 3.5rem;
  }

  p {
    font-size: 1.2rem;
  }
}
@media (min-width: 1025px) {
  section#left {
    background-position-x: 0;
  }
  input {
    width: 300px;
    height: 60px;
    font-size: 1.5rem;
  }
  button.login {
    font-size: 1.5rem;
    width: 150px;
    height: 40px;
  }
  p {
    font-size: 1.5rem;
  }
}
</style>