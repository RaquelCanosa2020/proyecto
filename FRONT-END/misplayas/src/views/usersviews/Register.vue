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
        <span>
          Acepto la
          <router-link :to="{name:'Privacidad'}">Política de Privacidad</router-link>
        </span>
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
      email: "galiplaya011@gmail.com",
      password1: "12345678",
      password2: "12345678",
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
  background-position-x: -160px;
  margin: 0;
  padding: 0;
}

section#girl img {
  margin-right: 0;
}
h1 {
  font-size: 1.5rem;
}

p,
span {
  font-size: 0.5rem;
}

button.register {
  font-size: 0.5rem;
  width: 75px;
  height: 10px;
}
input {
  width: 75px;
  height: 15px;
  font-size: 0.5rem;
}
input::placeholder {
  color: #4cbbb9;
  font-size: 0.5rem;
}
input#privacy {
  width: 5px;
  height: 5px;
}
@media (min-width: 700px) {
  div.register {
    height: 100vh;
    display: flex;
    justify-content: space-between;
    background-color: #ebecf1;
  }
  section#girl {
    background-position-x: -200px;
  }
  input {
    width: 150px;
    height: 35px;
    font-size: 1rem;
  }
  input::placeholder {
    font-size: 1rem;
  }
  input#privacy {
    width: 10px;
    height: 10px;
  }
  p,
  span {
    font-size: 1rem;
  }
  button.register {
    font-size: 1rem;
    width: 120px;
    height: 20px;
  }
}

@media (min-width: 1000px) {
  section#girl {
    background-position-x: -200px;
  }
  input {
    width: 250px;
    height: 55px;
    font-size: 1.2rem;
  }

  input::placeholder {
    font-size: 1.2rem;
  }
  input#privacy {
    width: 13px;
    height: 13px;
  }
  h1 {
    font-size: 3.5rem;
  }

  p,
  span {
    font-size: 1.2rem;
  }
}
@media (min-width: 1025px) {
  section#girl {
    background-position-x: 0;
  }
  input {
    width: 300px;
    height: 60px;
    font-size: 1.5rem;
  }
  button.register {
    font-size: 1.5rem;
    width: 150px;
    height: 40px;
  }
  p,
  span {
    font-size: 1.5rem;
  }
}
</style>