<template>
  <div class="register">
    <vue-headful title="Misplayas | Registro" />
    <h1>Formulario de Registro</h1>

    <p>
      <span>Nombre opcional</span>
      <input type="text" v-model="name" placeholder="Nombre" />
    </p>

    <p>
      <span>Obligatorio</span>
      <input type="email" v-model="email" placeholder="Email" />
    </p>

    <p>
      <span>Obligatorio</span>
      <input type="password" v-model="password1" placeholder="Contraseña" />
    </p>

    <p>
      <span>Obligatorio</span>
      <input type="password" v-model="password2" placeholder="Repite Contraseña" />
    </p>

    <button @click="addUser()">Registrarse</button>

    <p class="error" v-show="error">❌ {{messageError}}</p>
    <p class="ok">{{message}}</p>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "Register",
  data() {
    return {
      name: "Anónimo",
      email: "",
      password1: "",
      password2: "",
      message: "",
      messageError: "",
      error: false,
    };
  },
  methods: {
    async addUser() {
      if (this.password1 !== this.password2) {
        alert("los campos de contraseña no coinciden");
      } else {
        try {
          const response = await axios.post(
            "http://localhost:3000/beach/users",
            {
              name: this.name,
              email: this.email,
              password: this.password1,
            }
          );

          this.message = response.data.message;
          this.error = false;
          this.name = "";
          this.email = "";
          this.password1 = "";
          this.password2 = "";
        } catch (error) {
          this.error = true;
          this.messageError = error.response.data.message;
        }
      }
    },
  },
};
</script>

<style>
div.register {
  height: 100vh;
}
</style>