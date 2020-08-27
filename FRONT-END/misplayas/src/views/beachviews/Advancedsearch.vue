<template>
  <div class="all">
    <vue-headful title="misplayas | Buscador" />

    <!-----🔍-INICIO PANTALLA BÚSQUEDA AVANZADA----->
    <div id="list">
      <h1>BUSCA TU PLAYA</h1>

      <!-----OPCIONES PARA ORDENAR LAS PLAYAS--->
      <section id="order">
        <div>
          <p>Ordenar por:</p>
          <select v-model="order">
            <option value></option>
            <option value="name">Nombre</option>
            <option value="municipality">Municipio</option>
            <option value="province">Provincia</option>
            <option value="voteAverage">Valoración usuarios</option>
          </select>
        </div>
        <div>
          <p>Orden asc/desc:</p>
          <select v-model="direction">
            <option value="asc">Ascendente</option>
            <option value="desc">Descendente</option>
          </select>
        </div>
      </section>

      <!-----BUSCADOR AVANZADO (FECHA Y Nº DE PLAZAS A RESERVAR)--->

      <article id="advanced">
        <section id="dateplaces">
          <p>Fecha:</p>
          <input id="date" type="date" v-model="date" placeholder="fecha" />

          <p>Hora (formato 24 horas):</p>
          <select id="hour" v-model="hour">
            <option v-for="number in numbers" :key="number.id" :value="number">{{number}}</option>
          </select>

          <p>Número de plazas:</p>
          <select id="places" v-model="places">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </section>

        <!-----AVANZADO (OPCIONES Y SERVICIOS DE LAS PLAYAS)--->
        <section id="location">
          <p>Tipo de playa:</p>
          <select id="type" v-model="type">
            <option value></option>
            <option value="Urbana">Urbana</option>
            <option value="Semiurbana">Semiurbana</option>
            <option value="Aislada">Aislada</option>
          </select>

          <p>Provincia:</p>
          <select id="province" v-model="province">
            <option value></option>
            <option value="A Coruña">A Coruña</option>
            <option value="Lugo">Lugo</option>
            <option value="Ourense">Ourense</option>
            <option value="Pontevedra">Pontevedra</option>
          </select>

          <p>Municipio:</p>
          <select id="municipality" v-model="municipality">
            <option
              :class="{hidden: province !== muni.province}"
              v-for="muni in beachesMun"
              :key="muni.id"
              :value="muni.municipality"
            >{{muni.municipality}}</option>
          </select>
        </section>

        <section id="options">
          <label>
            <img src="@/assets/lifesaving.png" />
          </label>
          <input type="checkbox" value="lifesaving" v-model="lifesaving" />

          <label>
            <img src="@/assets/bar_restaurant.png" />
          </label>
          <input type="checkbox" value="bar_restaurant" v-model="bar_restaurant" />

          <label>
            <img src="@/assets/disabled_access.png" />
          </label>
          <input type="checkbox" value="disabled_access" v-model="disabled_access" />

          <label>
            <img src="@/assets/parking.png" />
          </label>
          <input type="checkbox" value="parking" v-model="parking" />

          <label>
            <img src="@/assets/toilet.png" />
          </label>
          <input type="checkbox" value="toilet" v-model="toilet" />
        </section>
        <button @click="hide">Borrar criterios</button>
      </article>

      <!--------FIN BUSCADOR AVANZADO--->

      <button @click="searchBeaches()">Buscar</button>

      <!---IMPORTAMOS EL COMPONENTE PARA LISTAR LAS PLAYAS
      ENVIAMOS DOS EVENTOS, UNO PARA COMENZAR UNA RESERVA Y OTRO PARA VER UNA PLAYA---->

      <onelistcomponent :beaches="beaches" />
    </div>
    <!------🔍-FIN ID LIST-BÚSQUEDA AVANZADA---->
  </div>
</template>

<script>
import axios from "axios";
import spinner from "@/components/Spinner.vue";
import onelistcomponent from "../../components/beachcomponents/Onelistcomponent.vue";
import photoscomponent from "../../components/beachcomponents/Photoscomponent.vue";
import ratingscomponent from "../../components/beachcomponents/Ratingscomponent.vue";
import {
  getAuthToken,
  getId,
  setServices,
  sweetAlertNotice,
  sweetAlertOk,
} from "../../api/utils";
export default {
  name: "Advancedsearch",
  components: {
    onelistcomponent,
    photoscomponent,
    ratingscomponent,
    spinner,
  },
  props: {
    data: Object,
    //optionssaved: Object,
  },

  data() {
    return {
      beaches: [],
      beachesMun: [],
      order: "",
      direction: "",
      visit: "",
      visitReservation: "",
      places: "",
      placesReservation: "",
      beachId: null,
      name: "",
      municipality: "",
      province: "",
      type: "",
      capacity: "",
      free: "",
      disponibilidad: "",
      notice: "",
      start_time: "",
      end_time: "",
      start_month: "",
      end_month: "",
      voteAverage: "",
      lifesaving: false,
      bar_restaurant: false,
      disabled_access: false,
      parking: false,
      toilet: false,
      disponibilidad: "",
      image: "",
      ccNumber: "",
      messageConfirm: {},
      date: "",
      dateReservation: "",
      hourReservation: "",
      hour: "",
      numbers: [],
      image: "",
      global: "",
      votes: [],
      photos: [],
      errorMessagePhotos: "",
      errorMessageVotes: "",
      reservInfo: false,
      spinner: true,
      beforeConfirm: false,
      skyState: "",
      temperature: "",
    };
  },
  computed: {
    //
    //FUNCIÓN PARA CONSEGUIR VISIT A PARTIR DE FECHA Y HORA QUE INTRODUZCA EL USUARIO
    getVisit() {
      let datehour = "";

      if (this.date === "" || this.hour === "") {
        datehour = "";
      } else {
        datehour = this.date + "T" + this.hour + ":" + "00";
      }
      console.log(datehour);
      return datehour;
    },
  },

  methods: {
    //FUNCIÓN PARA GENERAR LAS HORAS EN EL BUSCADOR
    getNumber() {
      let arrayNumber = [""];
      for (let number = 0; number <= 24; number++) {
        if (number < 10) {
          number = "0" + number;
        } else {
          number = number;
        }
        arrayNumber.push(number);
      }
      this.numbers = arrayNumber;
    },

    //FUNCIÓN PARA CONSEGUIR LOS MUNICIPIOS DE LAS PLAYAS Y GUARDAR OPCIONES DE BÚSQUEDA
    //EN CASO DE VENIR DE VISTA PLAYA O RESERVA. Y ACTIVAR BÚSQUEDA

    async getAdvanced() {
      try {
        const response = await axios.get(
          "http://localhost:3000/beaches/municipalities"
        );
        this.beachesMun = response.data.data.info;
        this.getNumber();
        if (this.$route.params.info) {
          this.lifesaving = this.$route.params.info.lifesaving;
          this.bar_restaurant = this.$route.params.info.bar_restaurant;
          this.disabled_access = this.$route.params.info.disabled_access;
          this.parking = this.$route.params.info.parking;
          this.toilet = this.$route.params.info.toilet;
          this.date = this.$route.params.info.date;
          this.hour = this.$route.params.info.hour;
          this.places = this.$route.params.info.places;
          this.type = this.$route.params.info.type;
          this.municipality = this.$route.params.info.municipality;
          this.province = this.$route.params.info.province;
        } else {
          this.lifesaving = false;
          this.bar_restaurant = false;
          this.disabled_access = false;
          this.parking = false;
          this.toilet = false;
          this.date = "";
          this.hour = "";
          this.places = "";
          this.type = "";
          this.municipality = "";
          this.province = "";
        }
        this.searchBeaches();
      } catch (error) {
        sweetAlertNotice(error.response.data.message);
      }
    },

    //FUNCIÓN PARA  OCULTAR BÚSQUEDA AVANZADA, Y QUE BORRE LAS OPCIONES
    hide() {
      this.lifesaving = false;
      this.bar_restaurant = false;
      this.disabled_access = false;
      this.parking = false;
      this.toilet = false;
      this.date = "";
      this.hour = "";
      this.places = "";
      this.type = "";
      this.municipality = "";
      this.province = "";
      this.searchBeaches();
    },

    //FUNCIÓN PARA BUSCAR PLAYAS CON/SIN CRITERIOS DE BÚSQUEDA
    async searchBeaches() {
      this.visit = this.getVisit; //MONTAMOS VISIT

      //LLAMADA DE AXIOS A LA API

      try {
        const response = await axios.post(
          `http://localhost:3000/beaches/search?order=${this.order}&direction=${this.direction}`,
          {
            lifesaving: this.lifesaving,
            bar_restaurant: this.bar_restaurant,
            disabled_access: this.disabled_access,
            parking: this.parking,
            toilet: this.toilet,
            visit: this.visit,
            places: this.places,
            type: this.type,
            municipality: this.municipality,
            province: this.province,
          }
        );
        this.beaches = response.data.data;

        //RECOGEMOS LA INFO QUE QUEREMOS TENER DISPONIBLE EN UN OBJETO

        const infoOptions = {
          visit: this.visit,
          places: this.places,
          lifesaving: this.lifesaving,
          bar_restaurant: this.bar_restaurant,
          disabled_access: this.disabled_access,
          parking: this.parking,
          toilet: this.toilet,
          date: this.date,
          hour: this.hour,
          type: this.type,
          municipality: this.municipality,
          province: this.province,
        };

        //EMITIMOS EVENTO PARA PASAR ESTA INFO A APP

        this.$emit("getInfo", infoOptions);
      } catch (error) {
        sweetAlertNotice(error.response.data.message);
      }
    },

    //FUNCIÓN PARA VER LOS DATOS DE UNA PLAYA CON/SIN DISPONIBILIDAD
    async showData(beachId) {
      this.visit = this.getVisit;

      try {
        const response = await axios.post(
          `http://localhost:3000/beaches/${beachId}/show`,
          {
            visit: visit,
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
        this.disponibilidad = response.data.data.disponibilidad;
        this.notice = response.data.data.aviso;
        this.skyState = response.data.data.estado;
        this.temperature = response.data.data.temperatura;
      } catch (error) {
        sweetAlertNotice(error.response.data.message);
      }
      this.seeVotes(beachId);
      this.seePhotos(beachId);
    },
    //FUNCIÓN PARA ASIGNAR NOMBRE A LOS MESES EN LA INFO DE LA PLAYA
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

    //FUNCIÓN PARA CONSEGUIR MUNICIPIOS DE LAS PLAYAS EN LA BD

    async getMunic() {
      try {
        const response = await axios.get(
          "http://localhost:3000/beaches/municipalities"
        );
        this.beachesMun = response.data.info;
        console.log(response.data);
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
    this.getAdvanced();
    //this.searchBeaches();
  },
};
</script>
<style scoped>
div.all {
  background-image: url("../../assets/Orilla.jpg");
}
h1 {
  font-size: 3rem;
}

input#datetime,
input#date {
  width: 250px;
  height: 20px;
}
input#ccNumber {
  width: 500px;
  height: 20px;
}

article#advanced select {
  height: 20px;
}
input {
  width: 10px;
  height: 10px;
  font-size: 1rem;
  margin: 1rem;
}

.hidden {
  display: none;
}

section#order,
section#dateplaces,
section#location {
  display: flex;
  justify-content: center;
  margin: auto;
}
img {
  width: 80px;
}

img#sky {
  width: 70px;
  height: 70px;
}

label > img,
p > img {
  width: 30px;
}
div#list {
  width: 75%;
  margin: auto;
}
article {
  background-color: #ebecf1;
  width: 75%;
  margin: auto;
  border-radius: 2em;
}

article#reservation {
  padding-top: 2rem;
}

ul {
  background-color: #ebecf1;
  list-style: none;
  width: 50%;
  margin: auto;
}
section#data > ul {
  display: flex;
  justify-content: space-around;
}

section#data > img {
  width: 1000px;
  margin: auto;
}

li {
  margin-bottom: 1rem;
}
</style>