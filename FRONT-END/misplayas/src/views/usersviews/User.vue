<template>
  <div class="user">
    <vue-headful title="Misplayas | Perfil de usuario" />

    <!--- <button @click="seeData =! seeData, getUserData()">Ver y editar datos</button>-->
    <button @click="seePassword =! seePassword">Cambiar contraseña</button>
    <button @click="seeReserv">Ver mis reservas</button>
    <button @click="seeBeaches">Ver mis playas</button>
    <button @click="seePhotos">Ver mis fotos</button>
    <button>
      <router-link to="/uploads">Subir fotos</router-link>
    </button>

    <section id="userdata" v-show="seeData">
      <p>Id: {{userId}}</p>
      <p>
        <input type="text" placeholder="Nombre" v-model="newName" />
        <input type="text" placeholder="Email" v-model="newEmail" />
      </p>
      <p>Perfil: {{newRole}}</p>

      <img :src="setImage(newAvatar)" />

      <form name="subida-imagenes" type="POST" enctype="multipart/formdata">
        <input type="file" ref="uploadedImage" />
        <input type="submit" name="subir-imagen" value="Enviar imagen" @click="uploadImage" />
      </form>

      <button id="edit" @click="updateUser()">Aceptar cambios</button>
      <button id="cancel" @click="seeData = false">Cancelar</button>
    </section>

    <section id="password" v-show="seePassword">
      <p>
        <input type="password" placeholder="Contraseña actual" v-model="oldPassword" />
        <input type="password" placeholder="Nueva contraseña" v-model="newPassword" />

        <button id="editPassword" @click="updatePassword()">Cambiar</button>
        <button id="cancel" @click="seePassword = false">Cancelar</button>
      </p>
    </section>

    <section v-show="showReserv">
      <p>{{errorMessage}}</p>
    </section>

    <section v-show="showBeach">
      <button @click="showBeach = false, seeData=true">Volver</button>
      <userbeachcomponent :userbeaches="userbeaches" />
    </section>

    <section v-show="showPhotos">
      <button @click="showPhotos = false, seeData=true">Volver</button>
      <userphotocomponent v-on:send="erasePhoto" :userphotos="userphotos" />
    </section>
  </div>
</template>
<script>
import {
  logout,
  getAuthToken,
  getId,
  sweetAlertOk,
  sweetAlertNotice,
  sweetAlertBorrar,
} from "../../api/utils";

import axios from "axios";
import listreservation from "../../components/usercomponents/Listreservation";
import userbeachcomponent from "../../components/usercomponents/Userbeachcomponent";
import userphotocomponent from "../../components/usercomponents/Userphotocomponent";

export default {
  name: "User",
  components: {
    listreservation,
    userbeachcomponent,
    userphotocomponent,
  },
  data() {
    return {
      seeData: true,
      seePassword: false,
      showReserv: false,
      showBeach: false,
      showPhotos: false,
      vote: true,
      userId: "",
      newName: "",
      newEmail: "",
      newRole: "",
      newAvatar: "",
      oldPassword: "",
      newPassword: "",
      uploadedImage: "",
      message: "",
      errorMessage: "",
      reservations: [],
      userbeaches: [],
      userphotos: [],
    };
  },
  methods: {
    //FUNCIÓN PARA SACAR LA DIRECCIÓN DE LA IMAGEN ACTUAL
    setImage(img) {
      if (img === null) {
        let avatar = "Avatar.jpg";
        return process.env.VUE_APP_STATIC + avatar;
      } else {
        return process.env.VUE_APP_STATIC + img;
      }
    },

    //FUNCIÓN PARA OBTENER LOS DATOS DEL USUARIO
    async getUserData() {
      this.seePassword = false;
      this.showReserv = false;
      this.showBeach = false;
      this.showPhotos = false;
      const id = getId();
      console.log(id);
      const token = getAuthToken();

      axios.defaults.headers.common["Authorization"] = `${token}`;

      try {
        const response = await axios.get(
          "http://localhost:3000/beach/users/" + id
        );
        console.log(response.data.data.image);
        this.newName = response.data.data.name;
        this.newEmail = response.data.data.email;
        this.newRole = response.data.data.role;
        this.newAvatar = response.data.data.image;
        this.userId = id;
      } catch (error) {
        sweetAlertNotice(error.response.data.message);
      }
    },

    //FUNCIÓN PARA RECUPERAR IMAGEN QUE INCLUYE EL USUARIO
    uploadImage() {
      this.uploadedImage = this.$refs.uploadedImage.files[0];

      sweetAlertOk("foto modificada");
      this.updateUser();
    },

    //FUNCIÓN PARA ACTUALIZAR DATOS DEL USUARIO
    async updateUser() {
      const id = getId();
      const token = getAuthToken();
      axios.defaults.headers.common["Authorization"] = `${token}`;
      console.log(id);

      try {
        let userNewData = new FormData();
        userNewData.append("name", this.newName);
        userNewData.append("email", this.newEmail);
        userNewData.append("avatar", this.uploadedImage);

        const response = await axios.put(
          "http://localhost:3000/beach/users/" + id,

          //{ name: this.newName, email: this.newEmail, avatar: this.newAvatar },
          userNewData,
          { header: { "Content-Type": "multipart/form-data" } }
        );
        sweetAlertOk(response.data.message);
        console.log(response.data.previousEmail);

        //mandamos desde el back el email previo. Si se ha cambiado, deslogueamos al usuario.
        if (this.newEmail !== response.data.previousEmail) {
          logout();
          this.$router.push("/login");
          setTimeout(() => {
            location.reload();
          }, 2000);
        } else {
          //si no se ha cambiado, sólo recargamos la página
          setTimeout(() => {
            location.reload();
          }, 2000);
        }
      } catch (error) {
        sweetAlertNotice(error.response.data.message);
      }
    },

    //FUNCIÓN PARA ACTUALIZAR CONTRASEÑA

    async updatePassword() {
      const id = getId();
      const token = getAuthToken();
      axios.defaults.headers.common["Authorization"] = `${token}`;
      console.log(id);

      try {
        const response = await axios.post(
          `http://localhost:3000/beach/users/${id}/password`,
          {
            oldPassword: this.oldPassword,
            newPassword: this.newPassword,
          }
        );

        sweetAlertOk(response.data.message);
        this.oldPassword = "";
        this.newPassword = "";
        logout();
        this.$router.push("/login");
        setTimeout(() => {
          location.reload();
        }, 1000);
      } catch (error) {
        sweetAlertNotice(error.response.data.message);
      }
    },

    //FUNCIÓN PARA VER RESERVAS DEL USUARIO

    async seeReserv() {
      this.showReserv = true;
      this.seeData = false;
      this.seePassword = false;
      this.showBeach = false;
      this.showPhotos = false;
      const id = getId();
      const token = getAuthToken();
      axios.defaults.headers.common["Authorization"] = `${token}`;
      console.log(id);

      try {
        const response = await axios.get(
          `http://localhost:3000/beach/users/${id}/reservations`
        );
        console.log(response.data.data);
        this.reservations = response.data.data;
      } catch (error) {
        sweetAlertNotice(error.response.data.message);
      }
    },

    //FUNCIÓN PARA VER PLAYAS DEL USUARIO

    async seeBeaches() {
      this.showBeach = true;
      this.seePassword = false;
      this.seeData = false;
      this.showReserv = false;
      this.showPhotos = false;
      const id = getId();
      const token = getAuthToken();
      axios.defaults.headers.common["Authorization"] = `${token}`;
      console.log(id);

      try {
        const response = await axios.get(
          `http://localhost:3000/beach/users/${id}/beaches`
        );
        console.log(response.data.data);
        this.userbeaches = response.data.data;
      } catch (error) {
        sweetAlertNotice(error.response.data.message);
      }
    },

    //FUNCIÓN PARA VER FOTOS DEL USUARIO
    async seePhotos() {
      this.showPhotos = true;
      this.showBeach = false;
      this.seePassword = false;
      this.seeData = false;
      this.showReserv = false;
      const id = getId();
      const token = getAuthToken();
      axios.defaults.headers.common["Authorization"] = `${token}`;
      console.log(id);

      try {
        const response = await axios.get(
          `http://localhost:3000/beach/users/${id}/photos`
        );
        console.log(response.data.data);
        this.userphotos = response.data.data;
      } catch (error) {
        sweetAlertNotice(error.response.data.message);
      }
    },
    //FUNCIÓN PARA BORRAR FOTOS DEL USUARIO

    async erasePhoto(Photoid) {
      console.log(Photoid);
      sweetAlertBorrar();

      try {
        const response = await axios.delete(
          `http://localhost:3000/beaches/photos/${Photoid}`
        );
      } catch (error) {
        sweetAlertNotice(error.response.data.message);
      }
    },
  },
  created() {
    this.getUserData();
  },
};
</script>
<style scoped>
div {
  height: 100vh;
}
.textarea {
  width: 250px;
  height: 150px;
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
img {
  width: 150px;
  border-radius: 50%;
}
</style>

