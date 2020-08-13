<template>
  <div class="user">
    <vue-headful title="Misplayas | Perfil de usuario" />

    <button @click="seeData =! seeData, getUserData()">Ver y editar datos</button>
    <section id="userdata" v-show="seeData">
      <p>Id: {{userId}}</p>
      <p>
        <input type="text" placeholder="Nombre" v-model="newName" />
        <input type="text" placeholder="Email" v-model="newEmail" />
        <input type="text" placeholder="Perfil" v-model="newRole" />
        <button id="edit" @click="updateUser()">Aceptar cambios</button>
        <button id="cancel" @click="seeData = false">Cancelar</button>
      </p>

      <img :src="setImage(newAvatar)" />

      <form name="subida-imagenes" type="POST" enctype="multipart/formdata">
        <input type="file" ref="uploadedImage" @change="uploadImage" />
        <input type="submit" name="subir-imagen" value="Enviar imagen" />
      </form>
      <p>{{message}}</p>
      <p>{{errorMessage}}</p>
    </section>

    <button @click="seePassword =! seePassword">Cambiar contraseña</button>
    <section id="password" v-show="seePassword">
      <p>
        <input type="password" placeholder="Contraseña actual" v-model="oldPassword" />
        <input type="password" placeholder="Nueva contraseña" v-model="newPassword" />

        <button id="editPassword" @click="updatePassword()">Cambiar</button>
        <button id="cancel" @click="seePassword = false">Cancelar</button>
      </p>
      <p>{{message}}</p>
      <p>{{errorMessage}}</p>
    </section>

    <button @click="seeReserv">Ver mis reservas</button>
    <button @click="seeBeaches">Ver mis playas</button>

    <button>
      <router-link to="/uploads">Subir fotos</router-link>
    </button>

    <section v-show="showReserv">
      <button @click="showReserv = false">Volver</button>
      <listreservation :reservations="reservations" />
      <p>{{message}}</p>
      <p>{{errorMessage}}</p>
    </section>

    <section v-show="showBeach">
      <button @click="showBeach = false">Volver</button>
      <userbeachcomponent :userbeaches="userbeaches" />

      <p>{{message}}</p>
      <p>{{errorMessage}}</p>
    </section>
  </div>
</template>
<script>
import { getAuthToken, getId } from "../../api/utils";
import { logoutUser } from "../../App.vue";
import axios from "axios";
import listreservation from "../../components/usercomponents/Listreservation";
import userbeachcomponent from "../../components/usercomponents/Userbeachcomponent";

export default {
  name: "User",
  components: {
    listreservation,
    userbeachcomponent,
  },
  data() {
    return {
      seeData: false,
      seePassword: false,
      showReserv: false,
      showBeach: false,
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
        this.errorMessage = error.response.data.message;
        userbeaches;
      }
    },

    //FUNCIÓN PARA RECUPERAR IMAGEN QUE INCLUYE EL USUARIO
    uploadImage() {
      this.uploadedImage = this.$refs.uploadedImage.files[0];
      console.log(this.uploadedImage);
    },

    //FUNCIÓN PARA ACTUALIZAR DATOS DEL USUARIO
    async updateUser() {
      //this.sweetAlertEdit();
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
        this.message = response.data.message;
      } catch (error) {
        this.errorMessage = error.response.data.message;
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
        this.message = response.data.message;
        alert(message);
        this.oldPassword = "";
        this.newPassword = "";
        logoutUser();
      } catch (error) {
        this.errorMessage = error.response.data.message;
      }
    },

    /*exit() {
      const id = getId();
      logoutUser(id);
    },*/

    //FUNCIÓN PARA VER RESERVAS DEL USUARIO

    async seeReserv() {
      this.showReserv = true;
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
        this.errorMessage = error.response.data.message;
        alert(this.errorMessage);
      }
    },

    //FUNCIÓN PARA MOSTRAR LA INFORMACIÓN DE LA RESERVA
    /*showReservInfo(ReservData) {
      this.idReserv = ReservData.id;
      this.newValue = ReservData.value;
      this.newComment = ReservData.comment;
      this.vote = true;
    },*/

    //FUNCIÓN PARA VALORAR RESERVAS DEL USUARIO

    async voteReserv(reservId) {
      console.log(reservId);
      const token = getAuthToken();
      axios.defaults.headers.common["Authorization"] = `${token}`;

      try {
        const response = await axios.post(
          `http://localhost:3000/beach/reservations/${reservId}/vote`,
          {
            value: this.newValue,
            comment: this.newComment,
          }
        );
        console.log(response.data.data);
      } catch (error) {
        this.errorMessage = error.response.data.message;
      }
    },
    //FUNCIÓN PARA VER PLAYAS DEL USUARIO

    async seeBeaches() {
      this.showBeach = true;
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
        this.errorMessage = error.response.data.message;
      }
    },
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

