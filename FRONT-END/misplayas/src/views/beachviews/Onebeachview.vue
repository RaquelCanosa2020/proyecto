<template>
  <div class="beach">
    <vue-headful title="misplayas | Playa" />
    <!---<onebeachcomponent @send="showData" />--->

    <h1>{{name}}</h1>
    <div id="principal">
      <section id="data">
        <img id="principal" :src="setImage(image)" />
        <p id="marked">{{disponibilidad}}</p>
        <p>{{notice}}</p>

        <p>Id: {{$route.params.id}}, Municipio: {{municipality}}</p>
        <p>Provincia: {{province}}</p>
        <p>Tipo: {{type}}</p>
        <p>Descripción: {{description}}</p>
        <p>Capacidad: {{capacity}} personas</p>
        <p>Horario: de {{start_time}} a {{end_time}}</p>
        <p>Meses de reserva obligatoria: de {{nameMonth(start_month)}} a {{nameMonth(end_month)}}</p>
      </section>
      <section id="options">
        <p>Previsión Meteogalicia para la fecha consultada</p>

        <p>
          <img id="sky" :src="skyState" />
          <span>{{temperature}} ºC</span>
        </p>
        <p>Valoración medida de usuarios</p>
        <p>
          <button id="rating">{{voteAverage}}</button>
        </p>

        <p>Servicios disponibles:</p>
        <ul>
          <li>
            <img src="@/assets/lifesaving.png" />
            {{lifesaving}}
          </li>
          <li>
            <img src="@/assets/parking.png" />
            {{parking}}
          </li>
          <li>
            <img src="@/assets/toilet.png" />
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
      </section>
    </div>

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

    <!-------📸-SECCIÓN DE FOTOS DE LA PLAYA HECHAS POR USUARIOS--->
    <section v-show="showPhotos" id="photos">
      <h2>Fotos de los usuarios</h2>

      <!--IMPORTAMOS COMPONENTE DE FOTOS--->
      <photoscomponent :photos="photos" />
      <p>{{errorMessagePhotos}}</p>
    </section>

    <!-------👍-SECCIÓN DE RATING Y OPINIONES--->
    <section v-show="showRating" id="rating">
      <h2>Valoraciones y comentarios de los usuarios</h2>

      <!--IMPORTAMOS COMPONENTE DE RATINGS--->

      <ratingscomponent :global="global" :votes="votes" />

      <p>{{errorMessageVotes}}</p>
    </section>
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
export default {
  name: "beach",
  components: {
    onebeachcomponent,
    photoscomponent,
    ratingscomponent,
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
    };
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

    //FUNCIÓN PARA CONSEGUIR VISIT A PARTIR DE FECHA Y HORA QUE INTRODUZCA EL USUARIO

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
        this.notice = response.data.data.aviso;
        this.skyState = response.data.data.estado;
        this.temperature = response.data.data.temperatura;
      } catch (error) {
        sweetAlertNotice(error.response.data.message);
      }
      this.seeVotes(id);
      this.seePhotos(id);
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
    async seeVotes(id) {
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
    //FUNCIÓN PARA VER LAS FOTOS DE UNA PLAYA HECHAS POR USUARIOS
    async seePhotos(id) {
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
  },
};
</script>

<style scoped >
div.beach {
  background-color: #ebecf1;
  padding: 1rem;
}
div#principal {
  display: flex;
  margin-right: 150px;
  justify-content: space-around;
  text-align: left;
}

img#principal {
  width: 700px;
}

img#sky {
  width: 70px;
  height: 70px;
}

li > img,
p > img {
  width: 20px;
}
div#list {
  width: 75%;
  margin: auto;
}
article {
  background-color: #ebecf1;
  width: 75%;
  margin: auto;
}

article#reservation {
  padding-top: 2rem;
}

ul {
  display: flex;
  list-style: none;
  width: 50%;
  margin: auto;
}
section#data > ul {
  display: flex;
  justify-content: space-around;
}

li {
  margin-bottom: 1rem;
}
section#options {
  color: #086972;
}
</style>
