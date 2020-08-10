<template>
  <div>
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

    <p>{{message}}</p>
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

          this.name = "";
          this.email = "";
          this.password1 = "";
          this.password2 = "";
        } catch (error) {
          this.message = error.response.data.message;
        }
      }
    },
  },
};
</script>

<style>
</style>