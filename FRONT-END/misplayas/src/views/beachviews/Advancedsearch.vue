<template>
  <div class="all">
    <vue-headful title="misplayas | Buscar" />
    <div id="right">
      <div class="options">
        <!-----SECCIÓN ELEGIR FECHA-Y PLAZAS-->
        <section id="dateplaces">
          <label>DISPONIBILIDAD</label>
          <p>
            Fecha
            <input id="date" type="date" v-model="date" placeholder="fecha" />
          </p>
          <p>
            0-24h
            <select id="hour" v-model="hour">
              <option v-for="number in numbers" :key="number.id" :value="number">{{number}}</option>
            </select>
          </p>
          <p>
            Plazas
            <select id="places" v-model="places">
              <option value></option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </p>
        </section>

        <!-----SECCIÓN ELEGIR TIPO Y LOCALIZACIÓN PLAYA--->
        <section id="location">
          <label>UBICACIÓN</label>
          <p>
            Tipo de playa
            <select id="type" v-model="type">
              <option value></option>
              <option value="Urbana">Urbana</option>
              <option value="Semiurbana">Semiurbana</option>
              <option value="Aislada">Aislada</option>
            </select>
          </p>
          <p>
            Provincia
            <select id="province" v-model="province">
              <option value></option>
              <option value="A Coruña">A Coruña</option>
              <option value="Lugo">Lugo</option>
              <option value="Ourense">Ourense</option>
              <option value="Pontevedra">Pontevedra</option>
            </select>
          </p>
          <p>
            Municipio
            <select id="municipality" v-model="municipality">
              <option value></option>
              <option
                :class="{hidden: province !== muni.province}"
                v-for="muni in beachesMun"
                :key="muni.id"
                :value="muni.municipality"
              >{{muni.municipality}}</option>
            </select>
          </p>
        </section>

        <!-----SECCIÓN ELEGIR POR SERVICIOS--->

        <section id="services">
          <label id="labelservices">SERVICIOS</label>
          <article id="services">
            <label>
              <img src="@/assets/lifesaving.png" />
              <input type="checkbox" value="lifesaving" v-model="lifesaving" />
            </label>

            <label>
              <img src="@/assets/bar_restaurant.png" />
              <input type="checkbox" value="bar_restaurant" v-model="bar_restaurant" />
            </label>

            <label>
              <img src="@/assets/disabled_access.png" />
              <input type="checkbox" value="disabled_access" v-model="disabled_access" />
            </label>

            <label>
              <img src="@/assets/parking.png" />
              <input type="checkbox" value="parking" v-model="parking" />
            </label>
            <label>
              <img src="@/assets/toilet.png" />
              <input type="checkbox" value="toilet" v-model="toilet" />
            </label>
          </article>
        </section>

        <!-----ELEGIR CRITERIOS Y DIRECCIÓN DE ORDENACIÓN--->
        <div id="end">
          <p>Ordenar por:</p>
          <section id="order">
            <select id="order" v-model="order">
              <option value></option>
              <option value="name">Nombre</option>
              <option value="municipality">Municipio</option>
              <option value="province">Provincia</option>
              <option value="voteAverage">Valoración usuarios</option>
            </select>
            <button class="direction" @click="direction = 'asc'">&#8679;</button>
            <button class="direction" @click="direction = 'desc'">&#8681;</button>
          </section>
          <!---BOTONES--->
        </div>
      </div>
    </div>
    <div id="left">
      <vue-headful title="misplayas | Buscador" />

      <!-----🔍-INICIO PANTALLA BÚSQUEDA AVANZADA----->

      <h1>BUSCA TU PLAYA</h1>

      <!--BUSCADOR INICIO----->

      <!--------FIN BUSCADOR AVANZADO--->

      <!---IMPORTAMOS EL COMPONENTE PARA LISTAR LAS PLAYAS
      ENVIAMOS DOS EVENTOS, UNO PARA COMENZAR UNA RESERVA Y OTRO PARA VER UNA PLAYA---->
      <div id="main">
        <section id="button">
          <button id="search" @click="searchBeaches()">BUSCAR</button>
          <button @click="hide">Borrar criterios</button>
        </section>
        <div id="list" v-if="isLoaded">
          <onelistcomponent :beaches="beaches" />
        </div>
        <div v-else>
          <spinner />
        </div>
      </div>

      <!------🔍-FIN ID LIST-BÚSQUEDA AVANZADA---->
    </div>
  </div>
</template>

<script>
import axios from "axios";
import spinner from "@/components/Spinner.vue";
import onelistcomponent from "../../components/beachcomponents/Onelistcomponent.vue";

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
    spinner,
  },
  props: {
    data: Object,
  },

  data() {
    return {
      beaches: null,
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
      spinner: true,
    };
  },
  computed: {
    //
    //FUNCIÓN PARA CONSEGUIR VISIT A PARTIR DE FECHA Y HORA QUE INTRODUZCA EL USUARIO
    getVisit() {
      let datehour = "";

      if (
        this.date === "" ||
        this.hour === "" ||
        this.date === undefined ||
        this.hour === undefined
      ) {
        datehour = "";
      } else {
        datehour = this.date + "T" + this.hour + ":" + "00";
      }
      console.log(datehour);
      return datehour;
    },
    isLoaded() {
      return this.beaches !== null;
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
  },
  created() {
    this.getAdvanced();
    //this.searchBeaches();
  },
};
</script>
<style scoped>
div.all {
  background-image: url(../../assets/Orilla.jpg);
  background-size: cover;
}
div#right {
  width: 100%;
  padding-top: 2rem;
}
div#left {
  width: 100%;
  background-color: #ebecf19f;
}

div.options,
div#list {
  width: 80%;
  margin: auto;
}
div.options {
  display: flex;
  justify-content: center;
}
section {
  display: flex;
  flex-direction: column;
  border: 1px solid #353a64;
  padding: 4px;
  border-radius: 2em;
}
section#dateplaces,
section#location,
section#services {
  background-color: #ebecf1;
}
article#services {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
}

div.options p,
div#end p {
  color: #353a64;
  margin-right: 1.3rem;
  font-weight: 800;
  font-size: 0.7rem;
}

input,
select {
  width: 100px;
  height: 20px;
  border-radius: 2em;
  margin: 0;
  font-size: 0.6rem;
}
select#hour,
select#places {
  width: 40px;
}

article,
section {
  margin-bottom: 1rem;
}
div#main {
  display: flex;
}

div#end {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

section#order {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}
section#button {
  border: none;
  margin-top: 2rem;
}
button#search {
  font-weight: 800;
  margin-bottom: 2rem;
}

h1 {
  font-size: 2rem;
  padding: 1rem;
}

button.direction {
  width: 25px;
  height: 25px;
  background-color: white;
  border-radius: 0;
  border-color: #353a64 solid;
  border-style: solid;
  margin-left: 0.5rem;
}

.hidden {
  display: none;
}

img {
  width: 80px;
}

section#services img {
  width: 20px;
  height: 20px;
}

section#services input {
  width: 10px;
  height: 10px;
  margin-right: 2rem;
}
label {
  text-align: center;
  font-weight: 600;
  font-size: 0.8rem;
}
p {
  font-size: 0.5;
}

div#list {
  width: 75%;
  margin: auto;
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
label {
  display: flex;
  margin-top: 1rem;
}
@media (min-width: 700px) {
}

@media (min-width: 1000px) {
  div.all {
    display: flex;
    background-image: url(../../assets/Orilla.jpg);
    background-size: cover;
  }
  div#right {
    width: 25%;
    padding-top: 2rem;
  }
  div#left {
    width: 75%;
    background-color: #ebecf19f;
  }
  div.options {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  section {
    padding: 10px;
  }
  div.options p,
  div#end p {
    color: #353a64;
    margin-right: 1.3rem;
    font-weight: 800;
    font-size: 1rem;
  }

  input,
  select {
    width: 150px;
    height: 30px;
    font-size: 1rem;
  }
  select#hour,
  select#places {
    width: 40px;
  }
  h1 {
    font-size: 3rem;
    padding: 2rem;
  }
  label {
    text-align: center;
    font-weight: 600;
    font-size: 1rem;
  }

  p {
    font-size: 0.7;
  }
  section#services img {
    width: 30px;
    height: 30px;
  }
  div#end {
    justify-content: space-around;
  }
  button.direction {
    width: 40px;
  }
}
</style>