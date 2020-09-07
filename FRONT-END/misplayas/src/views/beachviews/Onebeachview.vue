<template>
  <div class="beach">
    <vue-headful title="Galiplaya | Playa" />

    <div id="all" v-if="isLoaded">
      <section id="header">
        <h1>{{name}}</h1>
        <p
          id="header"
        >Id: {{$route.params.id}}, Municipio: {{municipality}}, Provincia: {{province}}</p>
      </section>
      <section id="date">
        <p id="date">{{date}}</p>
        <p>{{notice}}</p>
      </section>

      <div id="on">
        <section id="meteo" :class="{hidden: !skyState && !temperature }">
          <img id="sky" :src="skyState" />
          <span>{{temperature}} ºC</span>
          <!--Aplico hidden, ya que a veces no hay info meteo a más de 2-3 días-->
          <p id="meteo">Fuente: Meteogalicia</p>
        </section>
        <section id="marked">
          <p>{{disponibilidad}} plazas libres</p>
        </section>
      </div>
      <section id="graph">
        <img id="principal" :src="setImage(image)" />
        <article id="link">
          <img class="icon" src="../../assets/ubicacion.png" />
          <a id="link" :href="urlMaps">Ver en googleMaps</a>
        </article>
      </section>
      <div id="under">
        <section id="services">
          <ul>
            <li>
              <img src="@/assets/anillo-de-vida.png" />
              {{lifesaving}}
            </li>
            <li>
              <img id="parking" src="@/assets/estacionamiento.png" />
              {{parking}}
            </li>
            <li>
              <img id="toilet" src="@/assets/embolo.png" />
              {{toilet}}
            </li>
            <li>
              <img src="@/assets/comer.png" />
              {{bar_restaurant}}
            </li>
            <li>
              <img src="@/assets/sillaruedas.png" />
              {{disabled_access}}
            </li>
          </ul>
        </section>

        <section id="voteAverage">
          <p>Valoración usuarios:</p>
          <button id="voteAverage" @click="seeVotes">{{voteAverage}}</button>
        </section>
      </div>

      <section id="data">
        <article>
          <p>- Tipo: {{type}}</p>
          <p>- Descripción: {{description}}</p>
        </article>
        <article>
          <p>
            <img class="icon" src="../../assets/grupo.png" />
            {{capacity}} personas
          </p>

          <p>
            <img class="icon" src="../../assets/reloj.png" />
            Horario: de {{start_time}} a {{end_time}}
          </p>
          <p>
            <img class="icon" src="../../assets/calendario.png" />
            Meses de reserva obligatoria: de {{nameMonth(start_month)}} a {{nameMonth(end_month)}}
          </p>
        </article>
      </section>
      <section id="button">
        <button class="one">
          <router-link :to="{name:'Buscador', params:{info:this.info}}">Volver</router-link>
        </button>
        <button class="one">
          <router-link
            :to="{name:'Reserva', params: {id:this.id, name: this.name,
                municipality: this.municipality, province: this.province}}"
          >Reservar</router-link>
        </button>
      </section>

      <section id="beneath">
        <article id="buttons">
          <p>
            <button id="photos" @click="seePhotos">&#8681; ver + fotos &#8681;</button>
          </p>
          <p>
            <button id="rating" @click="seeVotes">&#8681; Ver valoraciones y comentarios &#8681;</button>
          </p>
        </article>
        <article id="none">
          <p class="error" v-show="showPhotos">{{errorMessagePhotos}}</p>
          <p class="error" v-show="showRating">{{errorMessageVotes}}</p>
        </article>
      </section>

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
      urlMaps: "",
    };
  },
  computed: {
    //SPINNER MIENTRAS CARGA EL TIEMPO
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

    async showData(id) {
      id = this.$route.params.id;
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
        this.setUrlMaps(id);
      } catch (error) {
        sweetAlertNotice(error.response.data.message);
      }
    },
    //FUNCIÓN PARA VER LA IMAGEN PRINCIPAL
    setImage(img) {
      if (img === null) {
        {
          let generic = "yellow.jpg";
          return process.env.VUE_APP_STATIC + generic;
        }
      } else if (!img) {
        return this.spinner;
      } else {
        return process.env.VUE_APP_STATIC + img;
      }
    },

    async setUrlMaps(id) {
      id = this.$route.params.id;
      console.log(id);
      try {
        const response = await axios.get(
          `http://localhost:3000/beaches/${id}/coord`
        );
        const coordinates = response.data.data;

        const googleUrl = "https://www.google.es/maps/place/";
        this.urlMaps = googleUrl + coordinates;
      } catch (error) {
        sweetAlertNotice(error.response.data.message);
      }
    },

    //FUNCIÓN PARA VER LOS VOTOS DE UNA PLAYA
    async seeVotes() {
      this.showPhotos = false;
      this.showRating = true;
      window.scrollBy(0, 1000);

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
      window.scrollBy(0, 1000);

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
/*div#all {
  padding: 0.5rem;
  display: grid;
  grid-gap: 0.5rem;
  grid-template-columns: 2.5fr 1fr;
  grid-template-rows: 100px 80px 50px 50px 50px 150px;
  grid-template-areas:
    "header voteAverage"
    "graphic meteo"
    "graphic marked"
    "date marked"
    "services button"
    "data data"
    "beneath beneath"
    "list list";
  place-items: center center;
}
section#header {
  grid-area: header;
}
h1 {
  font-size: 1rem;
  padding: 0;
  margin: 0;
}
section#imgAndLink {
  grid-area: photo;
}
article#link {
  display: flex;
  justify-content: center;
}
img#principal {
  max-width: 200px;
  border-radius: 2em;
}
li {
  margin-right: 0.5rem;
}
li img,
img.icon {
  width: 20px;
}
ul {
  list-style: none;
  display: flex;
  font-size: 0.5rem;
}
button#voteAverage {
  background-color: #4cbbb9;
  color: #353a64;
  font-weight: 900;
  font-size: 0.8rem;
  width: 60px;
}
section#meteo {
  grid-area: meteo;
  background-color: #0779e4;
  border-radius: 1em;
}
section#meteo span {
  color: white;
}
section#marked {
  grid-area: meteo;
  margin-right: 1rem;
  border-radius: 1em;
  border: solid #353a64 1px;
}
section#data p {
  text-align: left;
}
p {
  font-size: 0.5rem;
}
p#meteo,
section#marked p,
section#voteAverage p {
  font-size: 0.4rem;
}
section#marked {
  grid-area: marked;
}
section#voteAverage {
  grid-area: voteAverage;
}
span,
section#marked p#marked {
  font-size: 0.7rem;
  margin: 0;
}
section#date {
  grid-area: date;
}
section#data {
  grid-area: data;
  padding-left: 1rem;
}
section#button {
  grid-area: button;
}
a {
  text-decoration: none;
}
a#link {
  font-size: 0.5rem;
  text-decoration: underline;
  text-align: center;
  display: block;
}
section#services {
  grid-area: services;
  display: flex;
  padding-bottom: 1rem;
}
section#beneath {
  grid-area: beneath;
}
article#buttons {
  display: flex;
  justify-content: center;
}
button#photos,
button#rating {
  width: 100px;
}
section#photos,
section#rating {
  grid-area: list;
  width: 100%;
}
@media (min-width: 700px) {
  h1 {
    font-size: 1.8rem;
  }
  div#all {
    grid-template-rows: 50px 170px 200px 80px 50px 250px;
  }
  img#principal {
    max-width: 450px;
  }
  p {
    font-size: 1rem;
  }
  li {
    margin-right: 1rem;
  }
  li img,
  img.icon {
    width: 30px;
  }
  ul {
    font-size: 1rem;
  }
  p#meteo,
  section#marked p,
  section#voteAverage p {
    font-size: 0.7rem;
  }
  span,
  section#marked p#marked {
    font-size: 1.5rem;
  }
  img#sky {
    width: 70px;
    height: 70px;
  }
  button#photos,
  button#rating {
    width: 180px;
  }
  a#link {
    font-size: 0.8rem;
  }
}
@media (min-width: 1000px) {
  h1 {
    font-size: 2.2rem;
  }
  div#all {
    grid-template-columns: 4fr 1fr;
    grid-template-rows: 70px 300px 300px 100px 80px 350px;
  }
  img#principal {
    max-width: 700px;
  }
  p {
    font-size: 1.2rem;
  }
  li {
    margin-right: 1.2rem;
  }
  li img,
  img.icon {
    width: 40px;
  }
  ul {
    font-size: 1.2rem;
  }
  p#meteo,
  section#marked p,
  section#voteAverage p {
    font-size: 1rem;
  }
  p#meteo {
    color: white;
    font-size: 0.8rem;
  }
  span,
  section#marked p#marked {
    font-size: 2rem;
  }
  button#photos,
  button#rating {
    width: 180px;
  }
  section#meteo {
    border: none;
  }
  section#marked {
    border: 5px solid #353a64;
    align-self: flex-start;
  }
  button#voteAverage {
    font-size: 2rem;
    width: 120px;
    padding: 0.2rem;
  }
  a#link {
    font-size: 1.3rem;
  }
}
@media (min-width: 1300px) {
  div#all {
    padding: 2rem 5rem;
  }
  h1 {
    font-size: 3rem;
    padding-top: 2rem;
  }
  div.beach {
    background-image: url(../../assets/playa.jpg);
    background-size: cover;
  }
  div#all {
    background-color: #ebecf1b2;
    margin: 2rem 8rem;
    padding: 2rem 4rem;
    grid-template-columns: 4fr 1fr;
    grid-template-rows: 100px 200px 200px 100px 100px 400px;
  }
  img#principal {
    max-width: 500px;
  }
  button {
    width: 200px;
    margin-bottom: 1rem;
    font-size: 1.5rem;
  }
  button#voteAverage {
    background-color: #4cbbb9;
    color: #353a64;
    font-weight: 900;
    font-size: 2rem;
    width: 120px;
    padding: 0.2rem;
  }
  p {
    font-size: 1.4rem;
  }
  li {
    margin-right: 1.4rem;
  }
  li img,
  img.icon {
    width: 45px;
  }
  ul {
    font-size: 1.4rem;
  }
  p#meteo,
  section#marked p,
  section#voteAverage p {
    font-size: 1rem;
    padding: 1rem;
  }
  span,
  section#marked p#marked {
    font-size: 2rem;
  }
  button#photos,
  button#rating {
    width: 450px;
  }
  span,
  section#marked p#marked {
    font-size: 2rem;
  }
  p#meteo,
  section#marked p,
  section#voteAverage p {
    font-size: 1rem;
  }
  section#marked {
    border: 5px solid #353a64;
  }
  img.icon {
    width: 50px;
  }
}*/

img#principal {
  width: 100%;
  border-radius: 2em;
  margin-top: 1rem;
}
img.icon,
li img {
  width: 15px;
}

p,
li,
span,
a {
  font-size: 0.7rem;
}
p#meteo,
section#voteAverage p {
  font-size: 0.5rem;
}

ul {
  list-style: none;
  display: flex;
  margin: 0;
}
div#on,
div#under,
article#buttons {
  display: flex;
  justify-content: space-around;
}
section#meteo {
  border: solid blue 1px;
  border-radius: 1em;
  padding: 0.5rem;
}
section#marked {
  border: solid green 1px;
  border-radius: 1em;
  padding: 0.5rem;
}
section#services {
  margin-top: 2rem;
}
button#voteAverage {
  font-size: 0.8rem;
  background-color: rgb(0, 255, 242);
}
button.one {
  width: 70px;
  margin-right: 2px;
}
button.one a {
  text-decoration: none;
}
button#photos,
button#rating {
  width: 100px;
}
@media (min-width: 700px) {
  div#on {
    position: absolute;
    top: 325px;
    right: 100px;
  }
  section#meteo,
  section#marked {
    background-color: rgba(255, 255, 255, 0.788);
    margin-right: 5px;
  }
  img#principal {
    width: 80%;
  }
  img.icon,
  li img {
    width: 25px;
  }
  h1 {
    font-size: 2rem;
  }
  p,
  li,
  span,
  a {
    font-size: 0.9rem;
  }
  p#meteo,
  section#voteAverage p {
    font-size: 0.7rem;
  }
  button#voteAverage {
    font-size: 1rem;
  }
  li {
    margin-right: 5px;
  }
  button#photos,
  button#rating {
    width: 300px;
  }
  @media (min-width: 1000px) {
    section#graph {
      width: 80%;
    }
    div#on {
      flex-direction: column;
      position: absolute;
      top: 350px;
      right: 100px;
    }
    img.icon,
    li img {
      width: 25px;
    }
    h1 {
      font-size: 2.5rem;
    }
    li {
      margin-right: 2rem;
    }

    p,
    li,
    a {
      font-size: 1.1rem;
    }
    span {
      font-size: 1.8rem;
    }
    p#meteo,
    section#voteAverage p {
      font-size: 0.9rem;
    }
    button#voteAverage {
      font-size: 1.1rem;
    }
    button.one {
      width: 120px;
    }
    section#meteo {
      margin: 1rem 0;
    }
    article#link {
      text-align: left;
      margin-left: 10rem;
    }
    section#meteo {
      border: solid blue 2px;
    }
    section#marked {
      border: solid green 2px;
    }
    img#sky {
      width: 60px;
    }
  }
  @media (min-width: 1300px) {
    div#all {
      padding: 2rem;
    }
    section#header {
      flex-direction: column;
    }

    li {
      margin-right: 2rem;
    }
    img.icon,
    li img {
      width: 40px;
    }
    div#on {
      top: 330px;
      right: 400px;
    }
    h1 {
      font-size: 4rem;
      margin: 0;
    }
    p#header {
      margin: 0;
    }
    p,
    li,
    a {
      font-size: 1.4rem;
    }

    p#meteo,
    section#voteAverage p {
      font-size: 1.5rem;
    }
    button#voteAverage {
      font-size: 2rem;
    }
    button.one {
      width: 150px;
      font-size: 1.4rem;
    }
    button#photos,
    button#rating {
      width: 600px;
      font-size: 1.4rem;
    }

    section#voteAverage {
      position: absolute;
      top: 650px;
      right: 410px;
    }
    section#data,
    section#services {
      text-align: left;
      width: 50%;
      margin: auto;
    }

    article#link {
      text-align: left;
      margin-left: 10rem;
    }
    img#principal {
      width: 50%;
    }
  }
}
</style>
