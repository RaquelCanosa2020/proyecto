<template>
  <div class="upload">
    <vue-headful title="misplayas | Subir foto" />

    <select v-model="selectedBeach">
      <option
        v-for="beach in beaches"
        :key="beach.id"
        :value="beach.id"
      >{{beach.id}}, {{beach.name}}, {{beach.municipality}}</option>
    </select>

    <input type="datetime-local" placeholder="Fecha" v-model="date" />
    <br />
    <input class="comment" type="textarea" placeholder="Comentario" v-model="description" />

    <form name="subida-imagenes" type="POST" enctype="multipart/formdata">
      <input type="file" ref="uploadedImage" @change="uploadImage" />
      <input type="submit" name="subir-imagen" value="Enviar imagen" @click="saveImage" />
    </form>

    <!---<img :src="setImage(uploadedImage)" />--->
    <p>{{messageImage}}</p>

    <button>
      <router-link :to="{name:'Usuario'}">Volver</router-link>
    </button>
  </div>
</template>

<script>
import axios from "axios";

import { getAuthToken } from "../../api/utils";

export default {
  name: "uploads",

  data() {
    return {
      beaches: [],
      selectedBeach: "",
      id: null,
      name: "",
      municipality: "",
      uploadedImage: "",
      date: "",
      description: "",
      message: "",

      errorMessage: "",
      messageImage: "",
    };
  },
  methods: {
    //FUNCIÓN PARA VER IMAGEN
    setImage(img) {
      return process.env.VUE_APP_STATIC + img;
    },

    //FUNCIÓN PARA OBTENER LOS DATOS DE LA PLAYA

    async getBeaches() {
      try {
        const response = await axios.get(`http://localhost:3000/beaches`);

        this.beaches = response.data.data;
      } catch (error) {
        this.errorMessage = error.response.data.message;
      }
    },

    //FUNCIÓN PARA RECUPERAR IMAGEN QUE INCLUYE EL USUARIO
    uploadImage() {
      this.uploadedImage = /*this.$refs.uploadedImage*/ event.target.files[0];
      console.log(this.uploadedImage);
    },

    async saveImage() {
      const id = this.selectedBeach;
      console.log(id);
      const token = getAuthToken();
      axios.defaults.headers.common["Authorization"] = `${token}`;
      try {
        let newImageData = new FormData();
        newImageData.append("date", this.date);
        newImageData.append("description", this.description);
        newImageData.append("image", this.uploadedImage);

        const response = await axios.post(
          `http://localhost:3000/beaches/${id}/photos`,

          //{ name: this.newName, email: this.newEmail, avatar: this.newAvatar },
          newImageData,
          { header: { "Content-Type": "multipart/form-data" } }
        );

        console.log(response);

        this.messageImage = response.data.data.nºfoto;
      } catch (error) {
        this.errorMessage = error.response.data.message;
        alert(this.errorMessage);
      }
    },
  },
  created() {
    this.getBeaches();
  },
};
</script>
<style scoped>
div.beach {
  height: 100vh;
}

select {
  width: 300px;
  height: 50px;
}
</style>