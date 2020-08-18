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
      <button @click="getUsers">Ordenar</button>
    </section>

    <listuserscomponent v-on:sendEdit="showData" v-on:sendErase="eraseUser" :users="users" />

    <!---FIN ID LIST----->

    <!----MODAL PARA ACTUALIZAR CLIENTE-->
    <div v-show="seeModal" class="modal">
      <div class="modalBox">
        <h3>Editar datos</h3>
        <p>{{id}}</p>
        <input type="text" placeholder="Nombre del cliente" v-model="name" />
        <br />
        <input type="text" placeholder="Rol" v-model="role" />
        <br />
        <input type="text" placeholder="Email" v-model="email" />
        <br />
        <input type="number" placeholder="Activo" v-model="active" />
        <img :src="setImage(image)" />
        <br />
        <button @click="updateUser()">Actualizar cliente</button>

        <button @click="seeModal =! seeModal">Cancelar</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import listuserscomponent from "../../components/usercomponents/Listuserscomponent.vue";
import {
  getAuthToken,
  sweetAlertOk,
  sweetAlertNotice,
  sweetAlertErase,
} from "../../api/utils";

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
      id: null,
      name: "",
      role: "",
      email: "",
      active: "",
      image: "",
      seeModal: false,
    };
  },
  methods: {
    //FUNCIÓN PARA LISTAR LOS CLIENTES
    async getUsers() {
      const token = getAuthToken();
      axios.defaults.headers.common["Authorization"] = `${token}`;

      try {
        const response = await axios.get(
          `http://localhost:3000/beach/users?order=${this.order}&direction=${this.direction}`
        );
        console.log(response.data);

        this.users = response.data.data;
      } catch (error) {
        sweetAlertNotice(error.response.data.message);
      }
    },
    showData(userData) {
      this.seeModal = true;
      this.id = userData.id;
      this.name = userData.name;
      this.role = userData.role;
      this.email = userData.email;
      this.active = userData.active;
      this.image = userData.image;
    },

    async updateUser() {
      const token = getAuthToken();
      axios.defaults.headers.common["Authorization"] = `${token}`;

      try {
        let userNewData = new FormData();
        userNewData.append("name", this.name);
        userNewData.append("email", this.email);
        userNewData.append("role", this.role);
        userNewData.append("active", this.active);
        userNewData.append("avatar", this.image);

        const response = await axios.put(
          "http://localhost:3000/beach/users/" + this.id,

          userNewData,
          { header: { "Content-Type": "multipart/form-data" } }
        );
        sweetAlertOk(response.data.message);

        setTimeout(() => {
          this.seeModal = false;
          location.reload();
        }, 2000);
      } catch (error) {
        sweetAlertNotice(error.response.data.message);
      }
    },
    setImage(img) {
      if (img === null) {
        let avatar = "Avatar.jpg";
        return process.env.VUE_APP_STATIC + avatar;
      } else {
        return process.env.VUE_APP_STATIC + img;
      }
    },

    async eraseUser(userId) {
      const token = getAuthToken();
      axios.defaults.headers.common["Authorization"] = `${token}`;
      sweetAlertErase();

      try {
        const response = await axios.delete(
          "http://localhost:3000/beach/users/" + userId
        );

        sweetAlertOk(response.data.message);
        location.reload();
      } catch (error) {
        sweetAlertNotice(error.response.data.message);
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
