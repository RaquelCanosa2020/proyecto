<template>
  <div class="register">
    <vue-headful title="Misplayas | Registro" />

    <section id="left">
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

      <p>
        <input id="privacy" type="checkbox" value="accept" v-model="accept" />
        <span>Acepto la Política de Privacidad</span>
      </p>

      <button class="register" @click="addUser()">Registrarse</button>
    </section>
    <section id="girl">
      <p></p>
    </section>
  </div>
</template>

<script>
import axios from "axios";
import { sweetAlertOk, sweetAlertNotice } from "../../api/utils";
export default {
  name: "Register",
  data() {
    return {
      name: "Anónimo",
      email: "",
      password1: "",
      password2: "",
      accept: false,
    };
  },
  methods: {
    async addUser() {
      if (this.password1 !== this.password2) {
        alert("los campos de contraseña no coinciden");
      } else {
        try {
          if (this.accept === false) {
            const error = new Error();

            sweetAlertNotice(
              "Debes aceptar la Política de Privacidad para registrarte"
            );
            return error;
          }
          const response = await axios.post(
            "http://localhost:3000/beach/users",
            {
              name: this.name,
              email: this.email,
              password: this.password1,
            }
          );

          sweetAlertOk(response.data.message);
          this.error = false;
          this.name = "";
          this.email = "";
          this.password1 = "";
          this.password2 = "";
          this.accept = false;
        } catch (error) {
          sweetAlertNotice(error.response.data.message);
        }
      }
    },
  },
};
</script>

<style scoped>
div.register {
  height: 100vh;
  display: flex;
  justify-content: space-between;
  background-color: #ebecf1;
}

section#left {
  margin: auto;
}

section#girl {
  width: 50%;
  height: 100vh;
  background-image: url(../../assets/pino.jpg);
  background-size: cover;
  margin: 0;
  padding: 0;
}

section#girl img {
  margin-right: 0;
}
h1 {
  font-size: 3rem;
}

p,
span {
  font-size: 1.5rem;
}

button.register {
  font-size: 1.5rem;
  width: 150px;
  height: 40px;
}
input {
  width: 300px;
  height: 60px;
  font-size: 1.5rem;
}
input#privacy {
  width: 20px;
  height: 20px;
}
</style>