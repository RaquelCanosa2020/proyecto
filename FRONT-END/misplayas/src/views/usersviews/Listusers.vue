<template>
  <div class="listusers">
    <vue-headful title="misplayas | Lista Usuarios" />

    <h1>Listado de usuarios del Administrador</h1>
    <section id="order">
      <article>
        <p>Ordenar por:</p>
        <select v-model="order">
          <option value>Id</option>
          <option value="name">Nombre</option>
          <option value="registration_date">Fecha de registro</option>
        </select>
      </article>
      <article>
        <p>Orden asc/desc:</p>
        <button class="direction" @click="direction = 'asc'">&#8679;</button>
        <button class="direction" @click="direction = 'desc'">&#8681;</button>
      </article>
    </section>
    <button @click="getUsers">Ordenar</button>

    <listuserscomponent
      v-on:sendEdit="showData"
      v-on:sendErase="sweetAlertEraseUser"
      :users="users"
    />

    <!---FIN ID LIST----->

    <!----MODAL PARA ACTUALIZAR USUARIO-->
    <div v-show="seeModal" class="modal">
      <div class="modalBox">
        <h3>Editar datos</h3>
        <p>{{id}}</p>
        <p>
          <input type="text" placeholder="Nombre del cliente" v-model="name" />
        </p>

        <p>
          <input type="text" placeholder="Rol" v-model="role" />
        </p>

        <p>
          <input type="text" placeholder="Email" v-model="email" />
        </p>
        <p>
          <select v-model="active">
            <option value="1">Activo</option>
            <option value="0">Inactivo</option>
          </select>
        </p>

        <img :src="setImage(image)" />

        <button @click="updateUser()">Actualizar</button>

        <button @click="seeModal =! seeModal">Cancelar</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import spinner from "@/components/Spinner.vue";
import Swal from "sweetalert2";
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
  computed: {
    //PAGINACIÓN
    showedUsers() {
      return this.filtered.slice(
        this.currentIndex,
        this.currentIndex + this.beachesPerPage
      );
    },
    pages() {
      let numberOfPages = Math.ceil(this.users.length / this.elementsPerPage);
      let pageArray = [];
      for (let i = 0; i < numberOfPages; i++) {
        pageArray.push(i);
      }
    },
  },

  methods: {
    //FUNCIÓN PARA LISTAR LOS USUARIOS
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

        this.seeModal = false;
        this.getUsers();
      } catch (error) {
        sweetAlertNotice(error.response.data.message);
      }
    },
    setImage(img) {
      if (img === null) {
        {
          let avatar = "Avatar.jpg";
          return process.env.VUE_APP_STATIC + avatar;
        }
      } else if (!img) {
        return this.spinner; //esto lo incluyo para que no de error en consola, ya que debe tardar
        //algo en cargar las fotos y de primeras da 404 (aunque no se llega a ver el spinner)
      } else {
        return process.env.VUE_APP_STATIC + img;
      }
    },
    sweetAlertEraseUser(userId) {
      Swal.fire({
        title: "Confirma la acción",
        text: "Confirma la eliminación de este registro",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Confirmado",
        buttonsStyling: false,
      }).then((result) => {
        if (result.value) {
          this.eraseUser(userId);
        }
      });
    },

    async eraseUser(userId) {
      //sweetAlertErase();
      const token = getAuthToken();
      axios.defaults.headers.common["Authorization"] = `${token}`; //lo incluyo en el back.

      /*if (userId === "1") {
        sweetAlertNotice("No se puede eliminar al Administrador");
      } else {*/ try {
        const response = await axios.delete(
          "http://localhost:3000/beach/users/" + userId
        );

        sweetAlertOk(response.data.message);

        this.getUsers();
      } catch (error) {
        sweetAlertNotice(error.response.data.message);
      }

      //}
    },
  },
  created() {
    this.getUsers();
  },
};
</script>

<style scoped>
div.listusers {
  color: whitesmoke;
}

img {
  width: 150px;
  border-radius: 50%;
}
section#order {
  display: flex;
  justify-content: center;
}

select {
  width: 200px;
  height: 25px;
  font-size: 1rem;
  margin: 1rem;
}
button.direction {
  width: 40px;

  background-color: white;
  border-radius: 0;
  border-color: #353a64 solid;
  border-style: solid;
  margin-left: 0.5rem;
}
h3 {
  color: black;
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
