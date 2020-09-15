<template>
  <div class="all">
    <vue-headful title="Galiplaya | Buscar" />
    <div id="left">
      <!-----🔍-INICIO PANTALLA BÚSQUEDA AVANZADA----->

      <h1>BUSCA TU PLAYA</h1>

      <div class="options">
        <!-----SECCIÓN ELEGIR FECHA-Y PLAZAS-->
        <h5>Disponibilidad</h5>
        <section id="dateplaces">
          <article>
            <p>Fecha</p>
            <input id="date" type="date" v-model="date" placeholder="fecha" />
          </article>
          <article>
            <p>0-24h</p>
            <select id="hour" v-model="hour">
              <option v-for="number in numbers" :key="number.id" :value="number">{{number}}</option>
            </select>
          </article>
          <article>
            <p>Plazas</p>
            <select id="places" v-model="places">
              <option value></option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </article>
        </section>

        <!-----SECCIÓN ELEGIR TIPO Y LOCALIZACIÓN PLAYA--->
        <h5>Localización</h5>
        <section id="location">
          <article>
            <p>Tipo de playa</p>
            <select id="type" v-model="type">
              <option value></option>
              <option value="Urbana">Urbana</option>
              <option value="Semiurbana">Semiurbana</option>
              <option value="Aislada">Aislada</option>
            </select>
          </article>
          <article>
            <p>Provincia</p>
            <select id="province" v-model="province">
              <option value></option>
              <option value="A Coruña">A Coruña</option>
              <option value="Lugo">Lugo</option>
              <option value="Ourense">Ourense</option>
              <option value="Pontevedra">Pontevedra</option>
            </select>
          </article>
          <article>
            <p>Municipio</p>
            <select id="municipality" v-model="municipality">
              <option value></option>
              <option
                :class="{hidden: province !== muni.province}"
                v-for="muni in beachesMun"
                :key="muni.id"
                :value="muni.municipality"
              >{{muni.municipality}}</option>
            </select>
          </article>
        </section>

        <!-----SECCIÓN ELEGIR POR SERVICIOS--->
        <h5>Servicios</h5>
        <section id="services">
          <label>
            <img src="@/assets/anillo-de-vida.png" />
            <input type="checkbox" value="lifesaving" v-model="lifesaving" />
          </label>

          <label>
            <img src="@/assets/comer.png" />
            <input type="checkbox" value="bar_restaurant" v-model="bar_restaurant" />
          </label>

          <label>
            <img src="@/assets/sillaruedas.png" />
            <input type="checkbox" value="disabled_access" v-model="disabled_access" />
          </label>

          <label>
            <img src="@/assets/estacionamiento.png" />
            <input type="checkbox" value="parking" v-model="parking" />
          </label>
          <label>
            <img src="@/assets/embolo.png" />
            <input type="checkbox" value="toilet" v-model="toilet" />
          </label>
        </section>
      </div>
      <!-----ELEGIR CRITERIOS Y DIRECCIÓN DE ORDENACIÓN--->

      <h5>Ordenar por:</h5>
      <section id="order">
        <select id="order" v-model="order">
          <option value></option>
          <option value="name">Nombre</option>
          <option value="municipality">Municipio</option>
          <option value="province">Provincia</option>
          <option value="voteAverage">Valoración usuarios</option>
        </select>

        <!---BOTONES ASCENDENTE/DESCENDENTE--->
        <button class="direction" @click="direction = 'asc'">&#8679;</button>
        <button class="direction" @click="direction = 'desc'">&#8681;</button>
      </section>

      <section id="button">
        <button id="search" @click="searchBeaches()">BUSCAR</button>
        <button id="erase" @click="hide">Borrar criterios</button>
      </section>
    </div>

    <!--------FIN BUSCADOR AVANZADO--->

    <!---IMPORTAMOS EL COMPONENTE PARA LISTAR LAS PLAYAS--->

    <div id="main">
      <div id="list" v-if="isLoaded">
        <onelistcomponent :beaches="beaches" />
      </div>
      <div v-else>
        <spinner />
      </div>
    </div>

    <!------🔍-FIN ID LIST-BÚSQUEDA ---->
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
      places: "",
      beachId: null,
      name: "",
      municipality: "",
      province: "",
      type: "",
      capacity: "",
      free: "",
      disponibilidad: "",
      lifesaving: false,
      bar_restaurant: false,
      disabled_access: false,
      parking: false,
      toilet: false,
      disponibilidad: "",
      image: "",
      date: "",
      hour: "",
      numbers: [],
      image: "",
      spinner: true,
    };
  },
  computed: {
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

    //FUNCIÓN QUE MUESTRA SPINNER MIENTRAS NO SE CARGAN TODAS LAS PLAYAS
    isLoaded() {
      return this.beaches !== null;
    },
  },

  methods: {
    //FUNCIÓN PARA GENERAR LAS HORAS EN EL BUSCADOR
    getNumber() {
      let arrayNumber = [""];
      for (let number = 6; number <= 23; number++) {
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

    //FUNCIÓN PARA VER LA IMAGEN PRINCIPAL (en las de usuarios se aplica al componente)
    setImage(img) {
      if (!img) {
        return this.spinner; //mientras no carga imágenes
      } else {
        return process.env.VUE_APP_STATIC + img;
      }
    },
  },
  created() {
    this.getAdvanced();
  },
};
</script>
<style scoped>
html {
  margin: 0;
  padding: 0;
}
div.all {
  background-image: url(../../assets/Orilla.jpg);
  background-size: cover;
  min-height: 100vh;
}
div#left {
  background-color: #ebecf1af;
  padding: 0.8rem;
}
div.options {
  border-radius: 2em;
  padding: 10px 0;
}

label img {
  width: 10%;
}

label input {
  width: 3%;
}
h1 {
  font-size: 1.6rem;
  padding-top: 0.3rem;
}
h5 {
  margin: 0rem;
}

p {
  font-size: 0.6rem;
  margin: 0;
}

section#dateplaces,
section#location {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  border: 0.5px solid #353a64;
  border-radius: 2em;
  padding: 10px 0;
}

section#services {
  margin-top: 1rem;
}

section#button {
  margin-top: 1rem;
}
input#date {
  width: 100px;
  font-size: 0.6rem;
  margin: 0;
}

select#hour,
select#places {
  width: 40px;
  height: 15px;
  font-size: 0.6rem;
  border-radius: 1em;
  margin: 0;
}

select#type,
select#province,
select#municipality,
select#order {
  width: 90px;
  height: 15px;
  font-size: 0.6rem;
  border-radius: 1em;
  margin: 0.5;
}

button.direction {
  width: 30px;
  height: 15px;
}

button#search {
  width: 80px;
  background-color: #4cbbb9;
}
button#erase {
  width: 80px;
}
.hidden {
  display: none;
}

@media (min-width: 700px) {
  div.options {
    padding: 10px;
  }
  label img {
    width: 30px;
    height: 30px;
  }

  label input {
    width: 10px;
  }

  section#services {
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin-top: 1rem;
  }
  label {
    width: 50px;
    text-align: left;
  }
  section#dateplaces,
  section#location {
    flex-wrap: nowrap;
  }
  h5 {
    font-size: 1rem;
    padding-top: 1rem;
  }
  p {
    font-size: 0.8rem;
  }
  input#date,
  select {
    margin-right: 0.5rem;
  }
  label {
    display: flex;
  }
  input#date {
    width: 150px;
    font-size: 1rem;
  }
  select#hour,
  select#places {
    width: 60px;
    height: 20px;
    font-size: 1rem;
  }
  select#type,
  select#province,
  select#municipality,
  select#order {
    width: 200px;
    height: 20px;
    font-size: 1rem;
  }
  button.direction {
    width: 40px;
    height: 20px;
  }

  button#erase {
    width: 140px;
  }
  @media (min-width: 1000px) {
    label img {
      width: 30px;
      height: 30px;
    }

    label input {
      width: 20px;
    }

    label {
      width: 80px;
    }

    h5 {
      font-size: 1.2rem;
      padding-top: 1rem;
    }
    p {
      font-size: 1rem;
    }
    input#date,
    select {
      margin-right: 0.5rem;
    }

    input#date {
      width: 180px;
      font-size: 1.2rem;
    }
    select#hour,
    select#places {
      width: 80px;
      height: 25px;
      font-size: 1.2rem;
    }
    select#type,
    select#province,
    select#municipality,
    select#order {
      width: 300px;
      height: 25px;
      font-size: 1.2rem;
    }
    button.direction {
      width: 50px;
      height: 30px;
    }
    button#search,
    button#erase {
      width: 140px;
    }
    @media (min-width: 1300px) {
      section#dateplaces,
      section#location {
        flex-direction: column;
      }
      div.all {
        display: flex;
        justify-content: flex-start;
      }
      div#main {
        width: 70%;
        margin-left: 30%;
      }
      div#left {
        width: 25%;
        margin-left: 1rem;
        position: fixed;
        max-height: 80vh;
      }
      h1 {
        font-size: 2rem;
        margin: 0;
      }
      h5 {
        font-size: 1.4rem;
        padding-top: 1rem;
      }
      p {
        font-size: 1.3rem;
      }
      select#order {
        width: 200px;
        height: 25px;
        font-size: 1.2rem;
      }
      button {
        font-size: 1.2rem;
        width: 140px;
      }
      button#erase {
        width: 150px;
      }
    }
  }
}
</style>