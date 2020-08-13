<template>
  <div>
    <vue-headful title="misplayas | Lista Usuarios" />

    <h1>Listado de usuarios del Administrador</h1>
    <section id="order">
      <div>
        <p>Ordenar por:</p>
        <select v-model="order">
          <option value="name">Nombre</option>
          <option value="registration_date">Fecha de registro</option>
        </select>
      </div>
      <div>
        <p>Orden asc/desc:</p>
        <select v-model="direction">
          <option value="asc">Ascendente</option>
          <option value="desc">Descendente</option>
        </select>
      </div>
    </section>

    <listuserscomponent :users="users" />
  </div>
  <!---FIN ID LIST----->
</template>

<script>
import axios from "axios";
import listuserscomponent from "../../components/usercomponents/Listuserscomponent.vue";
import { setServices, getAuthToken, getId } from "../../api/utils";

export default {
  name: "Listusers",
  components: {
    listuserscomponent,
  },
  data() {
    return {
      users: [],
      order: "",
      direction: "",
    };
  },
  methods: {
    //FUNCIÓN PARA LISTAR LOS CLIENTES
    async getUsers() {
      console.log("hola");
      const token = getAuthToken();

      axios.defaults.headers.common["Authorization"] = `${token}`;

      try {
        const response = await axios.get(
          `http://localhost:3000/beach/users?order=${this.order}&direction=${this.direction}`
        );
        console.log(response.data);

        this.users = response.data.data;
      } catch (error) {
        console.log(error);
      }
    },
  },
  created() {
    this.getUsers();
  },
};
</script>

<style scoped>
section:not(#selected) {
  display: flex;
  justify-content: center;
}

img {
  width: 100px;
}

select {
  width: 200px;
  height: 25px;
  font-size: 1rem;
  margin: 1rem;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  background: rgba(0, 0, 0, 0.5);
}
.modalBox {
  background-color: #fefefe;
  margin: 2% auto;
  padding: 3rem;
  width: 80%;
  border: 1px solid #888;
}
</style>
