<template>
  <div class="home">
    <vue-headful title="misplayas | Buscador" />
    <img src="https://image.flaticon.com/icons/svg/3075/3075404.svg" />

    <!---INICIO PANTALLA BÚSQUEDA AVANZADA-->
    <div id="list" v-show="list">
      <h1>BUSCA TU PLAYA</h1>
      <section id="order">
        <div>
          <p>Ordenar por:</p>
          <select v-model="order">
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

      <button @click="getNumber">Avanzado</button>

      <article v-show="advanced" id="advanced">
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

        <section id="options">
          <label>Salvamento</label>
          <input type="checkbox" value="lifesaving" v-model="lifesavingSaved" />

          <label>Hostelería</label>
          <input type="checkbox" value="bar_restaurant" v-model="bar_restaurantSaved" />

          <label>Acceso d.funcional</label>
          <input type="checkbox" value="disabled_access" v-model="disabled_accessSaved" />

          <label>Parking</label>
          <input type="checkbox" value="parking" v-model="parkingSaved" />

          <label>WC</label>
          <input type="checkbox" value="toilet" v-model="toiletSaved" />
        </section>
      </article>
      <!--FIN BUSCADOR AVANZADO--->

      <button @click="searchBeaches()">Buscar</button>

      <!----MODAL DE NO HAY DATOS-->
      <div v-show="seeModal" class="modal">
        <div class="modalBox">
          <h3>No hay datos con los criterios de búsqueda</h3>

          <button @click="seeModal =! seeModal">Aceptar</button>
        </div>
      </div>
      <!---FIN CLASS MODAL--->

      <searchbeachescomponent v-on:sendIdReserve="seeData" :beaches="beaches" />
    </div>
    <!---FIN ID LIST-BÚSQUEDA AVANZADA---->

    <!--INICIO RESERVA--->
    <article id="reservation" v-show="reservation">
      <p>Playa: {{beachId}}</p>
      <section id="dateplaces">
        <input
          id="datetime"
          type="datetime-local"
          step="3600"
          v-model="visitReservation"
          placeholder="fecha y hora"
        />

        <p>Número de plazas:</p>
        <select v-model="placesReservation">
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
      </section>
      <section id="conditions">
        <p>Condiciones generales de la reserva:</p>

        <p>Número de tarjeta de crédito</p>:
        <input
          id="ccNumber"
          type="text"
          v-model="ccNumber"
          placeholder="Nº tarjeta crédito/débito"
        />

        <p>Importe: 3 euros (impuestos incluídos)</p>
      </section>

      <button @click="acceptReservation">Aceptar</button>
      <button @click="searchBeaches">Cancelar</button>
      <button @click="reservation = false, list = true">Volver</button>

      <p>{{messageConfirm}}</p>

      <p>{{errorMessage}}</p>
    </article>

    <!--FIN RESERVA--->
  </div>
</template>

<script>
import axios from "axios";
import searchbeachescomponent from "../../components/beachcomponents/Searchbeachescomponent.vue";

import { getAuthToken, getId, setServices } from "../../api/utils";
export default {
  name: "Advancedsearch",
  components: {
    searchbeachescomponent,
  },
  data() {
    return {
      beaches: [],
      order: "",
      direction: "",
      list: true,
      advanced: false,
      selected: false,
      reservation: false,
      seeModal: false,
      visit: "",
      visitReservation: "",
      places: "",
      placesReservation: "",
      beachId: null,
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
      lifesaving: false,
      lifesavingSaved: false,
      bar_restaurant: false,
      bar_restaurantSaved: false,
      disabled_access: false,
      disabled_accessSaved: false,
      parking: false,
      parkingSaved: false,
      toilet: false,
      toiletSaved: false,
      disponibilidad: "",
      aviso: "",
      image: "",
      ccNumber: "",
      messageConfirm: "",
      errorMessage: "",
      date: "",
      dateReservation: "",
      hourReservation: "",
      hour: "",
      numbers: [],
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
      console.log(this.numbers);
      this.advanced = true;
    },

    //FUNCIÓN PARA CONSEGUIR VISIT A PARTIR DE FECHA Y HORA
    getVisit(date, hour) {
      let datehour = "";

      if (date === "" || hour === "") {
        datehour = "";
      } else {
        datehour = date + "T" + hour + ":" + "00";
      }
      console.log(datehour);
      return datehour;
    },

    //FUNCIÓN PARA  VOLVER DEL BUSCADOR Y QUE SE GUARDEN LAS OPCIONES
    comeback() {
      this.selected = false;
      this.list = true;
      this.lifesaving = this.lifesavingSaved;
      this.bar_restaurant = this.bar_restaurantSaved;
      this.disabled_access = this.disabled_accessSaved;
      this.parking = this.parkingSaved;
      this.toilet = this.toiletSaved;
    },

    //FUNCIÓN PARA COMENZAR LA RESERVA

    seeData(beachId) {
      const idUser = getId();
      if (idUser === null) {
        this.$router.push("/login");
      } else {
        this.list = false;
        this.reservation = true;
        this.visitReservation = this.getVisit(this.date, this.hour);
        this.placesReservation = this.places;
        this.beachId = beachId;
      }
    },

    //FUNCIÓN PARA PAGAR Y CONFIRMAR LA RESERVA

    async acceptReservation(beachId) {
      try {
        const idUser = getId();
        console.log(idUser);
        const token = getAuthToken();

        console.log(
          `playa nº: ${this.beachId}, fecha ${this.visitReservation}, ${this.ccNumber}`
        );

        axios.defaults.headers.common["Authorization"] = `${token}`;
        const response = await axios.post(
          "http://localhost:3000/reservations",
          {
            visit: this.visitReservation,
            places: this.placesReservation,
            id_beach: this.beachId,
            cc_number: this.ccNumber,
          }
        );
        this.messageConfirm = response.data.message;
      } catch (error) {
        this.errorMessage = error.response.data.message;
      }

      this.selected = false;
    },

    //FUNCIÓN PARA BUSCAR PLAYAS
    async searchBeaches() {
      let visit = this.getVisit(this.date, this.hour);

      this.selected = false;
      this.reservation = false;
      this.list = true;

      //LLAMADA DE AXIOS A LA API

      try {
        const response = await axios.post(
          `http://localhost:3000/beaches/search?order=${this.order}&direction=${this.direction}`,
          {
            lifesaving: this.lifesavingSaved,
            bar_restaurant: this.bar_restaurantSaved,
            disabled_access: this.disabled_accessSaved,
            parking: this.parkingSaved,
            toilet: this.toiletSaved,
            visit: visit,
            places: this.places,
          }
        );
        this.beaches = response.data.data;
      } catch (error) {
        console.log(error);
        this.seeModal = true;
      }
    },

    //FUNCIÓN PARA VER LA IMAGEN PRINCIPAL (en las de usuarios se aplica al componente)
    setImage(img) {
      return process.env.VUE_APP_STATIC + img;
    },
  },
  created() {
    this.searchBeaches();
  },
};
</script>
<style scoped>
div#selected {
  width: 60%;
  margin: auto;
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
input {
  width: 10px;
  height: 10px;
  font-size: 1rem;
  margin: 1rem;
}
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  background: rgba(0, 0, 0, 0.5);
}
.modalBox {
  background-color: #fefefe;
  margin: 2% auto;
  padding: 3rem;
  width: 80%;
  border: 1px solid #888;
}
section#order,
section#dateplaces {
  display: flex;
  justify-content: center;
  margin: auto;
}
img {
  width: 80px;
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
</style>