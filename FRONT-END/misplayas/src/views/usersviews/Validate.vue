<template>
  <div class="validate">
    <vue-headful title="Misplayas | Validar usuario" />
    <h1>Validación de usuario</h1>

    <button @click="validateUser()">Validar</button>
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
}
</style>