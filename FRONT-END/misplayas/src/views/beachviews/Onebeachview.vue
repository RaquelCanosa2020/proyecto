<template>
  <div class="beach">
    <vue-headful title="misplayas | Playa" />
    <!---<onebeachcomponent @send="showData" />--->

    <div id="all" v-if="isLoaded">
      <h1>{{name}}</h1>
      <div id="main">
        <div id="left">
          <img id="principal" :src="setImage(image)" />

          <p>Servicios:</p>

          <ul>
            <li>
              <img src="@/assets/lifesaving.png" />
              {{lifesaving}}
            </li>
            <li>
              <img id="parking" src="@/assets/parking.png" />
              {{parking}}
            </li>
            <li>
              <img id="toilet" src="@/assets/toilet.png" />
              {{toilet}}
            </li>
            <li>
              <img src="@/assets/bar_restaurant.png" />
              {{bar_restaurant}}
            </li>
            <li>
              <img src="@/assets/disabled_access.png" />
              {{disabled_access}}
            </li>
          </ul>
        </div>

        <div id="right">
          <section id="date">
            <p>Fecha seleccionada: {{date}}</p>
            <p>{{notice}}</p>
          </section>

          <article id="meteo">
            <section :class="{hidden: !skyState && !temperature }">
              <img id="sky" :src="skyState" />
              <span>{{temperature}} ºC</span>

              <p id="meteo">Fuente: Meteogalicia</p>
            </section>

            <section id="marked">
              <p>Plazas disponibles:</p>
              <p id="marked">{{disponibilidad}}</p>
            </section>
          </article>

          <section id="data">
            <p>Id: {{$route.params.id}}, Municipio: {{municipality}}, Provincia: {{province}}</p>
            <p>Tipo: {{type}}</p>
            <p>Descripción: {{description}}</p>
            <p>Capacidad: {{capacity}} personas</p>
            <p>Horario: de {{start_time}} a {{end_time}}</p>
            <p>Meses de reserva obligatoria: de {{nameMonth(start_month)}} a {{nameMonth(end_month)}}</p>
          </section>
          <section id="button">
            <button>
              <router-link :to="{name:'Buscador', params:{info:this.info}}">Volver</router-link>
            </button>
            <button>
              <router-link
                :to="{name:'Reserva', params: {id:this.id, name: this.name,
      municipality: this.municipality, province: this.province}}"
              >Reservar</router-link>
            </button>
          </section>
          <section id="beneath">
            <p>
              <button id="photos" @click="seePhotos">&#8681; ver + fotos &#8681;</button>
            </p>

            <p>
              <button id="rating" @click="seeVotes">&#8681; Ver valoraciones y comentarios &#8681;</button>
            </p>
          </section>
          <p v-show="showPhotos">{{errorMessagePhotos}}</p>
          <p v-show="showRating">{{errorMessageVotes}}</p>
        </div>
      </div>
      <div id="down">
        <!-------📸-SECCIÓN DE FOTOS DE LA PLAYA HECHAS POR USUARIOS--->
        <section v-show="showPhotos" id="photos">
          <!--IMPORTAMOS COMPONENTE DE FOTOS--->
          <photoscomponent :photos="photos" />
        </section>

        <!-------👍-SECCIÓN DE RATING Y OPINIONES--->
        <section v-show="showRating" id="rating">
          <!--IMPORTAMOS COMPONENTE DE RATINGS--->

          <ratingscomponent :global="global" :votes="votes" />
        </section>
      </div>
    </div>
    <div v-else>
      <spinner />
    </div>
  </div>
</template>
<script>
import axios from "axios";
import {
  getAuthToken,
  getId,
  setServices,
  sweetAlertNotice,
  sweetAlertOk,
} from "../../api/utils";
import onebeachcomponent from "@/components/beachcomponents/Onebeachcomponent.vue";
import photoscomponent from "../../components/beachcomponents/Photoscomponent.vue";
import ratingscomponent from "../../components/beachcomponents/Ratingscomponent.vue";
import spinner from "@/components/Spinner.vue";

export default {
  name: "beach",
  components: {
    onebeachcomponent,
    photoscomponent,
    ratingscomponent,
    spinner,
  },
  props: {
    info: Object,
  },
  data() {
    return {
      //beach: {},
      visit: "",
      places: "",
      id: this.$route.params.id,
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
      notice: "",
      visitFormat: "",
      image: "",
      global: "",
      votes: [],
      photos: [],
      errorMessagePhotos: "",
      errorMessageVotes: "",
      skyState: "",
      temperature: "",

      showRating: false,
      showPhotos: false,
      date: "",
      avisoMeteo: "",
    };
  },
  computed: {
    isLoaded() {
      return this.skyState !== "" || this.temperature !== "";
    },
  },

  methods: {
    ///FUNCIÓN PARA ASIGNAR NOMBRE A LOS MESES EN LA INFO DE LA PLAYA
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

    //FUNCIÓN PARA CONSEGUIR LA INFO DE LA PLAYA

    async showData(id /*beachInfo*/) {
      id = this.$route.params.id;
      //this.visit = this.$route.params.visit;
      //this.places = this.$route.params.places;

      //this.id = beachInfo.id;
      this.visit = this.info.visit;
      this.places = this.info.places;

      try {
        const response = await axios.post(
          `http://localhost:3000/beaches/${id}/show`,
          {
            visit: this.visit,
            places: this.places,
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
        this.occupation = beachData.occupation;
        this.disponibilidad = response.data.data.disponibilidad;
        this.date = response.data.data.fecha;
        this.notice = response.data.data.aviso;
        this.skyState = response.data.data.estado;
        this.temperature = response.data.data.temperatura;
      } catch (error) {
        sweetAlertNotice(error.response.data.message);
      }
    },
    //FUNCIÓN PARA VER LA IMAGEN PRINCIPAL (en las de usuarios se aplica al componente)
    setImage(img) {
      if (!img) {
        return this.spinner; //esto lo incluyo para que no de error en consola, ya que debe tardar
        //algo en cargar las fotos y de primeras da 404 (aunque no se llega a ver el spinner)
      } else {
        return process.env.VUE_APP_STATIC + img;
      }
    },

    //FUNCIÓN PARA VER LOS VOTOS DE UNA PLAYA
    async seeVotes() {
      this.showPhotos = false;
      this.showRating = true;

      try {
        const response = await axios.get(
          `http://localhost:3000/beaches/${this.id}/votes`
        );
        this.votes = response.data.data;
        this.global = response.data.rating;
      } catch (error) {
        console.log(error);
        this.errorMessageVotes = error.response.data.message;
      }
    },
    //FUNCIÓN PARA VER LAS FOTOS DE UNA PLAYA HECHAS POR USUARIOS
    async seePhotos() {
      this.showRating = false;
      this.showPhotos = true;

      try {
        const response = await axios.get(
          `http://localhost:3000/beaches/${this.id}/photos`
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
  },
};
</script>

<style scoped >
div.beach {
  background-color: #ebecf1;
}
div#left {
  text-align: center;
  padding: 2rem;
}
div#riht {
  text-align: left;
  padding: 2rem;
}

div#main {
  display: flex;
  justify-content: space-around;
  background-color: #ebecf1;
}

h1 {
  font-size: 3rem;
}
p {
  color: #353a64;
  font-size: 1.2rem;
}
p#meteo {
  color: #ebecf1;
  font-size: 1rem;
}
span,
p#marked {
  color: #ebecf1;
  font-weight: 800;
  font-size: 1.5rem;
}
section#beneath {
  display: flex;
  justify-content: space-between;
}
section#data {
  text-align: left;
  margin-top: 4rem;
}
section#date p {
  color: #056676;
  margin: 2rem;
}

img#principal {
  width: 700px;
  border-radius: 2em;
}

img#sky,
img#wind {
  width: 70px;
  height: 70px;
}

img#toilet {
  height: 65px;
  position: relative;
  top: -2px;
}

img#parking {
  border-radius: 0.7em;
}

li > img,
p > img {
  width: 60px;
}

article {
  width: 75%;
  margin: auto;
  display: flex;
  justify-content: space-around;
}

article section {
  background-color: #353a64;
  padding: 2rem;
  border-radius: 2em;
}
article section#marked {
  background-color: #ebecf1;
  padding: 2rem;
  border-radius: 2em;
  border: solid #056676 1px;
}
article section#marked p {
  color: #056676;
}

ul {
  display: flex;
  list-style: none;
  width: 50%;
  background-color: #ebecf1;
}

li {
  margin: 1rem 2rem;
}
section#options {
  color: #086972;
}
div#down {
  background-image: url(../../assets/pared.jpg);
  background-size: cover;
}
button#photos,
button#rating {
  width: 300px;
}
button {
  border-radius: 0;
  border-color: white;
  border-style: solid;
  width: 100px;
  background-color: #59405c;
  color: white;
}
a {
  text-decoration: none;
  color: white;
}
.hidden {
  display: none;
}
</style>
