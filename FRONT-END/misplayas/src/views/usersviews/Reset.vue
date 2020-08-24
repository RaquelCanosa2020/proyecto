<template>
  <div class="reset">
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
}
</style>