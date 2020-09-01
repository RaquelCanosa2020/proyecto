<template>
  <div class="reset">
    <section id="up">
      <vue-headful title="Misplayas | Recuperación contraseña" />
      <h1>Recuperación de contraseña</h1>

      <p>
        <span>Obligatorio</span>
        <input type="password" v-model="password1" placeholder="Nueva Contraseña" />
      </p>

      <p>
        <span>Obligatorio</span>
        <input type="password" v-model="password2" placeholder="Repite Contraseña" />
      </p>

      <button @click="resertPassword()">Validar</button>
    </section>
    <section id="down"></section>
  </div>
</template>

<script>
import axios from "axios";
import { sweetAlertOk, sweetAlertNotice } from "../../api/utils";

export default {
  name: "Validate",

  data() {
    return {
      resetCode: "",
      password1: "",
      password2: "",
    };
  },

  methods: {
    async resertPassword() {
      if (this.password1 !== this.password2) {
        alert("los campos de contraseña no coinciden");
      } else {
        const resetUrl = window.location.href.split("?");
        this.resetCode = resetUrl[1];
        console.log(this.resetCode, this.password1);
        try {
          const response = await axios.post(
            `http://localhost:3000/beach/users/reset-password`,
            {
              recoverCode: this.resetCode,
              newPassword: this.password1,
            }
          );
          sweetAlertOk(response.data.message);
          this.$router.push("/login");
        } catch (error) {
          sweetAlertNotice(error.response.data.message);
        }
      }
    },
  },
};
</script>
<style scoped>
div.reset {
  height: 100vh;
  background-color: #ebecf1;
  display: flex;
  flex-direction: column;
}

section#up {
  margin: auto;
}
h1 {
  font-size: 1rem;
}

p {
  font-size: 0.7rem;
}
button {
  font-size: 0.5rem;
  width: 75px;
  height: 10px;
}
input {
  width: 100px;
  height: 25px;
  font-size: 0.5rem;
}
section#down {
  background-image: url(https://media.giphy.com/media/l4hLyOGRJWNSR8QQ8/giphy.gif);
  background-size: cover;
  height: 50vh;
}
@media (min-width: 700px) {
  h1 {
    font-size: 1.3rem;
  }

  p {
    font-size: 1rem;
  }
  button {
    font-size: 1rem;
    width: 120px;
    height: 20px;
  }
  input {
    width: 200px;
    height: 50px;
    font-size: 0.5rem;
  }
}

@media (min-width: 1000px) {
  h1 {
    font-size: 2rem;
  }

  p {
    font-size: 1rem;
  }
  button {
    font-size: 1.5rem;
    width: 150px;
    height: 40px;
  }
  input {
    width: 300px;
    height: 60px;
    font-size: 1.5rem;
  }
}
</style>