<template>
  <div class="beach">
    <vue-headful title="misplayas | Playa" />

    <!--SECCIÓN DE INFO PRINCIPAL DE LA PLAYA--->
    <article id="up">
      <section id="data">
        <h1>INFORMACIÓN COMPLETA DE LA PLAYA</h1>
        <p>Id: {{$route.params.id}}.Nombre: {{name}}, Municipio: {{municipality}}</p>
        <p>Provincia: {{province}}</p>
        <p>Tipo: {{type}}</p>
        <p>Descripción: {{description}}</p>
        <p>Capacidad: {{capacity}} personas</p>
        <p>Horario: de {{start_time}} a {{end_time}}</p>
        <p>Meses de reserva obligatoria: de {{nameMonth(start_month)}} a {{nameMonth(end_month)}}</p>
        <p>Valoración media de usuarios usuarios: {{voteAverage}}</p>
        <p>Servicios:</p>
        <p>Salvamento: {{lifesaving}}, Parking: {{parking}}, WC: {{toilet}}, Hostelería: {{bar_restaurant}}, Acceso minusv: {{disabled_access}}</p>

        <p>{{errorMessage}}</p>

        <img id="principal" :src="setImage(image)" />
        <router-link to="/search" tag="button">Volver al Buscador</router-link>
      </section>
      <!--SECCIÓN DE FOTOS DE LA PLAYA HECHAS POR USUARIOS--->

      <section id="photos">
        <h2>Fotos de los usuarios</h2>

        <photoscomponent :photos="photos" />
        <p>{{errorMessagePhotos}}</p>
      </section>
    </article>

    <article id="down">
      <!--SECCIÓN DE RATING Y OPINIONES--->
      <section id="rating">
        <h2>Valoraciones y comentarios de los usuarios</h2>

        <ratingscomponent :global="global" :votes="votes" />
        <p>{{errorMessageVotes}}</p>
      </section>
    </article>
  </div>
</template>

<script>
import axios from "axios";
import photoscomponent from "../../components/beachcomponents/Photoscomponent.vue";
import ratingscomponent from "../../components/beachcomponents/Ratingscomponent.vue";
import { setServices, getAuthToken, getId } from "../../api/utils";

export default {
  name: "Playa",
  components: {
    photoscomponent,
    ratingscomponent,
  },

  data() {
    return {
      id: null,
      name: "",
      municipality: "",
      province: "",
      description: "",
      type: "",
      capacity: "",
      start_time: "",
      end_time: "",
      start_month: "",
      end_month: "",
      voteAverage: "",
      lifesaving: "",
      bar_restaurant: "",
      disabled_access: "",
      parking: "",
      toilet: "",
      disponibilidad: "",
      image: "",
      global: "",
      votes: [],
      photos: [],
      errorMessage: "",
      errorMessageVotes: "",
      errorMessagePhotos: "",
    };
  },
  methods: {
    //FUNCIÓN PARA ASIGNAR NOMBRE A LOS MESES
    nameMonth(number) {
      const monthNames = [
        "enero",
        "febrero",
        "marzo",
        "abril",
        "mayo",
        "junio",
        "julio",
        "agosto",
        "septiembre",
        "octubre",
        "noviembre",
        "diciembre",
      ];

      return monthNames[number - 1];
    },

    //FUNCIÓN PARA VER LOS DATOS DE UNA PLAYA
    async showData(id) {
      id = this.$route.params.id;

      try {
        const response = await axios.post(
          `http://localhost:3000/beaches/${id}/show`,
          {
            visit: this.visitReservation,
            places: this.placesReservation,
          }
        );

        const beachData = response.data.data.info;
        console.log(response.data.data);

        this.beachId = beachData.id;
        this.name = beachData.name;
        this.municipality = beachData.municipality;
        this.province = beachData.province;
        this.description = beachData.description;
        this.type = beachData.type;
        this.capacity = beachData.capacity;
        this.start_time = beachData.start_time;
        this.end_time = beachData.end_time;
        this.start_month = beachData.start_month;
        this.end_month = beachData.end_month;
        this.voteAverage = beachData.voteAverage;
        this.lifesaving = setServices(beachData.lifesaving);
        this.parking = setServices(beachData.parking);
        this.toilet = setServices(beachData.toilet);
        this.bar_restaurant = setServices(beachData.bar_restaurant);
        this.disabled_access = setServices(beachData.disabled_access);
        this.image = beachData.image;
      } catch (error) {
        this.errorMessage = error.response.data.message;
      }
    },

    //FUNCIÓN PARA VER LA IMAGEN PRINCIPAL (en las de usuarios se aplica al componente)
    setImage(img) {
      return process.env.VUE_APP_STATIC + img;
    },
    async seeVotes(id) {
      id = this.$route.params.id;
      try {
        const response = await axios.get(
          `http://localhost:3000/beaches/${id}/votes`
        );
        this.votes = response.data.data;
        this.global = response.data.rating;
      } catch (error) {
        console.log(error);
        this.errorMessageVotes = error.response.data.message;
      }
    },

    async seePhotos(id) {
      id = this.$route.params.id;
      try {
        const response = await axios.get(
          `http://localhost:3000/beaches/${id}/photos`
        );
        this.photos = response.data.data;
      } catch (error) {
        console.log(error);
        this.errorMessagePhotos = error.response.data.message;
      }
    },
  },
  created() {
    this.showData();
    this.seeVotes();
    this.seePhotos();
  },
};
</script>
<style scoped>
div.beach {
  min-height: 100vh;
}
article#up {
  display: flex;
  justify-content: center;
}

section {
  background-color: #ebecf1;
}

section#photos {
  width: 50%;
}
img#principal {
  width: 800px;
}
</style>