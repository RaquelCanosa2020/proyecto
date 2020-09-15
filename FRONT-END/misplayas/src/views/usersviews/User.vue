<template>
  <div class="user">
    <vue-headful title="Galiplaya | Perfil de usuario" />

    <div id="left" :class="{transit: transition === true}">
      <!--Div para gestionar datos del usuario---->

      <section id="userdata">
        <!----Sección para ver y editar datos---->

        <h1>Datos de usuario</h1>
        <article id="name">
          <img :src="setImage(newAvatar)" />

          <p id="id">Usuario nº {{userId}}</p>

          <p>Nombre:</p>
          <input :class="{editclass: edit}" type="text" placeholder="Nombre" v-model="newName" />

          <p>Email:</p>
          <input :class="{editclass: edit}" type="text" placeholder="Email" v-model="newEmail" />

          <p>Tipo de perfil: {{newRole}}</p>
        </article>

        <button v-show="!edit" @click="showEdit()">Editar datos</button>

        <form v-show="upload" name="subida-imagenes" type="POST" enctype="multipart/formdata">
          <input type="file" ref="uploadedImage" />
        </form>

        <button id="edit" v-show="upload" @click="updateUser()">Aceptar</button>

        <button id="cancel" v-show="upload" @click="getUserData()">Cancelar</button>
      </section>
      <button class="large" v-show="edit" @click="seePassword =! seePassword">Cambiar contraseña</button>

      <section id="password" v-show="seePassword">
        <!----Sección para cmabiar contraseña---->
        <p>
          <input
            class="editclass"
            type="password"
            placeholder="Contraseña actual"
            v-model="oldPassword"
          />
          <input
            class="editclass"
            type="password"
            placeholder="Nueva contraseña"
            v-model="newPassword"
          />

          <button id="editPassword" @click="updatePassword()">Cambiar</button>
          <button id="cancel" @click="seePassword = false">Cancelar</button>
        </p>
      </section>
    </div>
    <div id="buttons">
      <!----Botones con opciones---->
      <button class="short" :class="{active: showReserv}" @click="seeReserv">Ver mis reservas</button>
      <button class="short" :class="{active: showBeach}" @click="seeBeaches">Ver mis playas</button>
      <button class="short" :class="{active: showPhotos}" @click="seePhotos">Ver mis fotos</button>

      <router-link to="/uploads">
        <img class="icono" id="camera" src="../../assets/camera.png" />Subir fotos >>
      </router-link>
    </div>
    <div id="right" :class="{transit: transition === true}">
      <section v-show="showReserv">
        <h1>
          <img class="icono" src="../../assets/storyboard.png" /> Tus reservas
        </h1>
        <p>
          Nº reservas:
          <span>{{numberReserv}}</span>
        </p>
        <p>
          Nª plazas acumulado:
          <span>{{numberPlaces}}</span>
        </p>
        <button @click="showReserv = false">Ocultar reservas</button>

        <listreservation :reservations="reservations" @sendIdEr="sweetAlertEraseReserv" />
      </section>

      <section v-show="showBeach">
        <button @click="showBeach = false">Ocultar playas</button>
        <userbeachcomponent :userbeaches="userbeaches" />
      </section>

      <section id="photos" v-show="showPhotos">
        <button @click="hidePhotos">Ocultar fotos</button>

        <userphotocomponent v-on:send="sweetAlertErasePhoto" :userphotos="userphotos" />
      </section>
    </div>
  </div>
</template>
<script>
import {
  logout,
  getAuthToken,
  getId,
  sweetAlertOk,
  sweetAlertNotice,
  sweetAlertErase,
} from "../../api/utils";

import axios from "axios";
import listreservation from "../../components/usercomponents/Listreservation";
import userbeachcomponent from "../../components/usercomponents/Userbeachcomponent";
import userphotocomponent from "../../components/usercomponents/Userphotocomponent";
import spinner from "@/components/Spinner.vue";
import Swal from "sweetalert2";

export default {
  name: "User",
  components: {
    listreservation,
    userbeachcomponent,
    userphotocomponent,
  },
  data() {
    return {
      seePassword: false,
      showReserv: true,
      showBeach: false,
      showPhotos: false,
      edit: false,
      upload: false,
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
      transition: false,
      numberPlaces: "",
      numberReserv: "",
    };
  },
  methods: {
    //FUNCIÓN PARA MOSTRAR OPCIONES DE EDICIÓN DE USUARIO
    showEdit() {
      this.edit = true;
      this.upload = true;
    },

    //FUNCIÓN PARA SACAR LA DIRECCIÓN DE LA IMAGEN ACTUAL
    setImage(img) {
      if (img === null) {
        {
          let avatar = "Avatar.jpg";
          return process.env.VUE_APP_STATIC + avatar;
        }
      } else if (!img) {
        return this.spinner;
      } else {
        return process.env.VUE_APP_STATIC + img;
      }
    },

    //FUNCIÓN PARA OBTENER LOS DATOS DEL USUARIO
    async getUserData() {
      this.edit = false;
      this.upload = false;
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

    //FUNCIÓN PARA RECUPERAR IMAGEN QUE INCLUYE EL USUARIO <p>{{errorMessage}}</p>
    uploadImage() {
      this.uploadedImage = this.$refs.uploadedImage.files[0];
    },

    //FUNCIÓN PARA ACTUALIZAR DATOS DEL USUARIO
    async updateUser() {
      const id = getId();
      const token = getAuthToken();
      axios.defaults.headers.common["Authorization"] = `${token}`;
      console.log(id);
      this.uploadImage();
      if (this.newName === "") {
        this.newName = "Anónimo";
      }

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
        } else {
          //si no se ha cambiado, sólo recargamos la página

          this.getUserData();
          this.edit = false;
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

        this.getUserData();
      } catch (error) {
        sweetAlertNotice(error.response.data.message);
      }
    },

    //FUNCIÓN PARA VER RESERVAS DEL USUARIO

    async seeReserv() {
      const id = getId();
      const token = getAuthToken();
      axios.defaults.headers.common["Authorization"] = `${token}`;
      console.log(id);

      try {
        const response = await axios.get(
          `http://localhost:3000/beach/users/${id}/reservations`
        );
        this.showReserv = true;
        this.showBeach = false;
        this.showPhotos = false;
        this.transition = false;
        this.reservations = response.data.data;
        this.numberReserv = response.data.reservas;
        this.numberPlaces = response.data.plazas;
      } catch (error) {
        sweetAlertNotice(error.response.data.message);
      }
    },

    sweetAlertEraseReserv(eraseInfo) {
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
          this.eraseReserv(eraseInfo);
        }
      });
    },

    async eraseReserv(eraseInfo) {
      const id = eraseInfo.id;
      const token = getAuthToken();
      axios.defaults.headers.common["Authorization"] = `${token}`;

      try {
        const response = await axios.delete(
          `http://localhost:3000/reservations/${id}`
        );
        this.showReserv = false;
        this.seeReserv();
        sweetAlertOk("registro eliminado");
      } catch (error) {
        sweetAlertNotice(error.response.data.message);
      }
    },

    //FUNCIÓN PARA VER PLAYAS DEL USUARIO

    async seeBeaches() {
      const id = getId();
      const token = getAuthToken();
      axios.defaults.headers.common["Authorization"] = `${token}`;
      console.log(id);

      try {
        const response = await axios.get(
          `http://localhost:3000/beach/users/${id}/beaches`
        );
        this.showBeach = true;
        this.seePassword = false;
        this.transition = false;
        this.showReserv = false;
        this.showPhotos = false;
        this.userbeaches = response.data.data;
      } catch (error) {
        sweetAlertNotice(error.response.data.message);
      }
    },

    //FUNCIÓN PARA VER FOTOS DEL USUARIO
    async seePhotos() {
      const id = getId();
      const token = getAuthToken();
      axios.defaults.headers.common["Authorization"] = `${token}`;
      console.log(id);

      try {
        const response = await axios.get(
          `http://localhost:3000/beach/users/${id}/photos`
        );
        this.showPhotos = true;
        this.showBeach = false;
        this.transition = true;
        this.showReserv = false;
        this.userphotos = response.data.data;
      } catch (error) {
        sweetAlertNotice(error.response.data.message);
      }
    },

    hidePhotos() {
      this.seePhotos;
      this.showPhotos = false;
      this.transition = false;
    },
    //FUNCIÓN PARA BORRAR FOTOS DEL USUARIO

    sweetAlertErasePhoto(Photoid) {
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
          this.erasePhoto(Photoid);
        }
      });
    },

    async erasePhoto(Photoid) {
      try {
        const response = await axios.delete(
          `http://localhost:3000/beaches/photos/${Photoid}`
        );
        sweetAlertOk("registro eliminado");
        this.showPhotos = false;
        this.seePhotos();
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
div.user {
  background-color: #ebecf1;
  min-height: 100vh;
}

div#left {
  width: 100%;
}
div#right.transit {
  width: 90%;
  background-image: none;
  background-color: #353a64;
}

div#right {
  background-image: url("../../assets/paso.jpg");
  background-size: cover;
  width: 100%;
  margin: 1rem;
  transition: width 1s;
}

div#left.transit {
  display: none;
}

div#buttons {
  display: flex;
  width: 100%;
}

section#photos {
  background-color: #ebecf1;
}
article#name {
  border: solid #353a64 1px;
  border-radius: 2em;
  padding: 2rem;
}

article#name p,
article#name span {
  text-align: left;
  color: #0779e4;
}
article#name input {
  text-align: left;
  color: #353a64;
}

article#name p#id {
  text-align: center;
  font-size: 1rem;
  text-decoration: underline;
}

section#password p {
  margin: 3rem auto;
}

article#name {
  width: 50%;
  margin: auto;
}
h1 {
  padding-top: 1rem;
  font-size: 1.5rem;
}
p {
  color: #353a64;
  text-align: left;
  font-size: 0.8rem;
  margin: 0;
}
span {
  color: brown;
  font-size: 1rem;
  font-weight: 800;
}

input {
  border-style: none;
  color: #59405c;
  font-size: 0.8rem;
  margin-bottom: 1rem;
}

input::placeholder {
  color: #353a64;
  font-size: 0.8rem;
}

input.editclass {
  border: 1px solid #0779e4;
  color: #0779e4;
  border-radius: 1em;
  font-size: 0.8rem;
  text-align: left;
  margin: 0.5rem;
}

img {
  width: 150px;
  border-radius: 50%;
}
img.icono {
  width: 40px;
  border-radius: 0;
}
img#camera {
  margin-right: 1rem;
}
button {
  margin: 0.5rem;
  font-size: 0.7rem;
  width: 100px;
}

button.large {
  border-radius: 0;
  border-color: white;
  border-style: solid;
  width: 200px;
  background-color: #59405c;
  color: white;
  margin-top: 3rem;
}

button.short {
  border-radius: 0;
  border-color: white;
  border-style: solid;
  height: 40px;
  background-color: #59405c;
  color: white;
  margin-top: 2rem;
}
button.short.active {
  background-color: #4cbbb9;
}

a {
  margin-top: 2rem;
  text-decoration: none;
  font-weight: 800;
}
@media (min-width: 700px) {
  h1 {
    font-size: 2.5rem;
  }
  p,
  input,
  input.editclass,
  input::placeholder {
    font-size: 1rem;
  }
  span {
    font-size: 1.2rem;
  }
  button {
    font-size: 1rem;
    width: 120px;
  }
  button.short {
    height: 50px;
  }
}

@media (min-width: 1025px) {
  div.user {
    background-color: #ebecf1;
    display: flex;
    justify-content: space-between;
    min-height: 100vh;
  }
  div#buttons {
    display: flex;
    flex-direction: column;
    width: 10%;
  }

  div#left {
    width: 40%;
  }
  div#right.transit {
    width: 90%;
    background-image: none;
    background-color: #353a64;
  }

  div#right {
    background-image: url("../../assets/paso.jpg");
    background-size: cover;
    width: 60%;
    transition: width 1s;
  }

  div#left.transit {
    display: none;
  }
  article#name p#id {
    font-size: 1.5rem;
  }

  p,
  input,
  input.editclass {
    font-size: 1.2rem;
  }
  span {
    font-size: 1.4rem;
  }
  button {
    font-size: 1.2rem;
    width: 140px;
    height: 50px;
  }
  button.short {
    height: 50px;
  }
}
</style>

