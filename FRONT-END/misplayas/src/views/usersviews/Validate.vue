<template>
  <div class="validate">
    <vue-headful title="Misplayas | Validar usuario" />

    <section id="up">
      <h1>Validación de usuario</h1>

      <button id="validate" @click="validateUser()">Validar</button>
    </section>
    <section id="down"></section>
  </div>
</template>

<script>
import axios from "axios";
import { sweetAlertOk, sweetAlertNotice } from "../../api/utils";

export default {
  name: "Validate",

  methods: {
    async validateUser() {
      let code = window.location.href.split("?");
      try {
        const response = await axios.get(
          `http://localhost:3000/beach/users/validate/${code[1]}`
        );
        sweetAlertOk(response.data.message);
        this.$router.push("/login");
      } catch (error) {
        sweetAlertNotice(error.response.data.message);
      }
    },
  },
};
</script>
<style scoped>
div.validate {
  height: 100vh;
  background-color: #ebecf1;
  display: flex;
  flex-direction: column;
}

section#up {
  margin: auto;
}
h1 {
  font-size: 3rem;
}

p {
  font-size: 1.5rem;
}
button.validate {
  font-size: 1.5rem;
  width: 150px;
  height: 40px;
}
input {
  width: 300px;
  height: 60px;
  font-size: 1.5rem;
}
section#down {
  background-image: url(https://media.giphy.com/media/l4hLyOGRJWNSR8QQ8/giphy.gif);
  background-size: cover;
  height: 50vh;
}
</style>