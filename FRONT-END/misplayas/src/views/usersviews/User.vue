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
      <p>Imagen</p>

      <img :src="newAvatar" />
      <button id="image">Subir nueva imagen</button>
      <form name="subida-imagenes" type="POST" enctype="multipart/formdata">
        <input type="file" name="photo" accept="image/*" @change="uploadImage" />
        <input type="submit" name="subir-imagen" value="Enviar imagen" />
      </form>
      <p>{{message}}</p>
    </section>

    <button>Hacer una reserva</button>

    <button @click="seePassword =! seePassword">Cambiar contraseña</button>
    <section id="password" v-show="seePassword">
      <p>
        <input type="text" placeholder="Contraseña actual" v-model="oldPassword" />
        <input type="text" placeholder="Nueva contraseña" v-model="newPassword" />

        <button id="editPassword" @click="updatePassword()">Cambiar</button>
        <button id="cancel" @click="seePassword = false">Cancelar</button>
      </p>
      <p>{{message}}</p>
      <p>Imagen</p>
    </section>

    <button>Ver mis reservas</button>

    <button>Ver mis playas</button>
  </div>
</template>
<script>
import { getAuthToken, getId } from "../../api/utils";
import axios from "axios";

export default {
  data() {
    return {
      seeData: false,
      seePassword: false,
      userId: "",
      newName: "",
      newEmail: "",
      newRole: "",
      newAvatar: "",
      oldPassword: "",
      newPassword: "",
      message: "",
    };
  },
  methods: {
    //FUNCIÓN PARA SACAR LA DIRECCIÓN DE LA IMAGEN ACTUAL
    setImage(img) {
      return process.env.VUE_APP_STATIC + img;
    },

    //FUNCIÓN PARA SUBIR NUEVA IMAGEN

    uploadImage(e) {
      const file = e.target.files[0];
      this.image = file;
      this.newAvatar = URL.createObjectURL(file);
    },

    //FUNCIÓN PARA OBTENER LOS DATOS DEL USUARIO
    async getUserData() {
      const id = getId();
      console.log(id);
      const token = getAuthToken();

      axios.defaults.headers.common["Authorization"] = `${token}`;

      //FUNCIÓN PARA ACTUALIZAR LOS DATOS DEL USUARIO (EXCEPTO CONTRASEÑA)

      try {
        const response = await axios.get(
          "http://localhost:3000/beach/users/" + id
        );

        this.newName = response.data.data.name;
        this.newEmail = response.data.data.email;
        this.newRole = response.data.data.role;
        let avatar1 = response.data.data.image;
        this.newAvatar = this.setImage(avatar1);
        this.userId = id;
      } catch (error) {
        console.log(error);
      }
    },

    //FUNCIÓN PARA ACTUALIZAR DATOS DEL USUARIO
    async updateUser() {
      //this.sweetAlertEdit();
      const id = getId();
      const token = getAuthToken();
      axios.defaults.headers.common["Authorization"] = `${token}`;
      console.log(id);

      //REVISAR, NO ME SUBE LA FOTO. 🏮
      try {
        let userNewData = new FormData();
        userNewData.append("name", this.newName);
        userNewData.append("email", this.newEmail);
        userNewData.append("avatar", this.uploadImage);

        const response = await axios.put(
          "http://localhost:3000/beach/users/" + id,

          //name: this.newName,
          //email: this.newEmail,
          //avatar: this.newAvatar,
          userNewData,
          { header: { "Content-Type": "multipart/form-data" } }
        );
        this.message = response.data.message;
      } catch (error) {
        console.log(error);
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
        this.oldPassword = "";
        this.newPassword = "";
      } catch (error) {
        console.log(error);
      }
    },
  },

  //raquelcanosara@gmail.com
};
</script>

