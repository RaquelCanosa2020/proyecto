<template>
  <div class="all">
    <div class="upload">
      <vue-headful title="Galiplaya | Subir foto" />

      <h1>Sube fotos de tus playas</h1>
      <label>Elige la playa:</label>
      <select v-model="selectedBeach">
        <option
          v-for="beach in beaches"
          :key="beach.id"
          :value="beach.id"
        >{{beach.id}}, {{beach.name}}, {{beach.municipality}}</option>
      </select>

      <input type="datetime-local" placeholder="Fecha" v-model="date" />

      <input
        id="comment"
        class="comment"
        type="textarea"
        placeholder="Comentario"
        v-model="description"
      />
      <img :src="setImage(messageLink)" />

      <form name="subida-imagenes" type="POST" enctype="multipart/formdata">
        <input type="file" ref="uploadedImage" @change="uploadImage" />
      </form>
      <input type="submit" name="subir-imagen" value="Enviar imagen" @click="saveImage" />

      <p>{{messageImage}}</p>

      <button>
        <router-link :to="{name:'Usuario'}">Volver</router-link>
      </button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import spinner from "@/components/Spinner.vue";
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
      see: false,
      spinner: false,
      errorMessage: "",
      messageImage: "",
      messageLink: "",
    };
  },
  methods: {
    //FUNCIÓN PARA VER IMAGEN
    setImage(img) {
      if (!img) {
        return this.spinner;
      } else {
        return process.env.VUE_APP_STATIC + img;
      }
    },

    //FUNCIÓN PARA OBTENER LOS DATOS DE LAS PLAYAS

    async getBeaches() {
      try {
        const response = await axios.post(
          `http://localhost:3000/beaches/search`
        );

        this.beaches = response.data.data;
      } catch (error) {
        this.errorMessage = error.response.data.message;
      }
    },

    //FUNCIÓN PARA RECUPERAR IMAGEN QUE INCLUYE EL USUARIO
    uploadImage() {
      this.uploadedImage = /*this.$refs.uploadedImage*/ event.target.files[0];
      console.log(this.uploadedImage);
      this.see = true;
    },

    //FUNCIÓN PARA GUARDAR IMAGEN QUE INCLUYE EL USUARIO

    async saveImage() {
      const id = this.selectedBeach;
      console.log(id);
      const token = getAuthToken();
      axios.defaults.headers.common["Authorization"] = `${token}`;
      try {
        let newImageData = new FormData();
        let datePhoto;
        if (this.date === "") {
          datePhoto = new Date();
        } else {
          datePhoto = this.date;
        }
        newImageData.append("date", datePhoto);
        newImageData.append("description", this.description);
        newImageData.append("image", this.uploadedImage);

        const response = await axios.post(
          `http://localhost:3000/beaches/${id}/photos`,

          newImageData,
          { header: { "Content-Type": "multipart/form-data" } }
        );

        this.see = true;

        this.messageImage = response.data.data.nºfoto;
        this.messageLink = response.data.data.nombre;
        console.log(this.messageLink);
      } catch (error) {
        this.errorMessage = error.response.data.message;
        alert(this.errorMessage);
        this.see = false;
      }
    },
  },
  created() {
    this.getBeaches();
  },
};
</script>
<style scoped>
div.all {
  background-image: url(../../assets/sunset.jpeg);
  background-size: cover;
}
div.upload {
  height: 100vh;
  width: 40%;
  margin: auto;
  padding: 3rem;
  background-color: #ebecf1b6;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
h1 {
  font-size: 1rem;
}

label,
select,
input#comment {
  width: 90%px;
  height: 30px;
  margin-top: 2rem;
  font-size: 0.8;
}

img {
  width: 200px;
}
p {
  font-size: 0.6rem;
}
a {
  text-decoration: none;
}
@media (min-width: 700px) {
  h1 {
    font-size: 1.2rem;
  }
  p {
    font-size: 1rem;
  }
}
@media (min-width: 1000px) {
  h1 {
    font-size: 1.5rem;
  }
}
</style>