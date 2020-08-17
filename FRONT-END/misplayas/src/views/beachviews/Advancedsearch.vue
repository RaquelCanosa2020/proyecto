<template>
  <div class="home">
    <vue-headful title="misplayas | Buscador" />
    <img src="https://image.flaticon.com/icons/svg/3075/3075404.svg" />

    <!-----🔍-INICIO PANTALLA BÚSQUEDA AVANZADA----->
    <div id="list" v-show="list">
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

        <!-----AVANZADO (OPCIONES Y SERVICIOS DE LAS PLAYAS)--->

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
      <!--------FIN BUSCADOR AVANZADO--->

      <button @click="searchBeaches()">Buscar</button>

      <!----MODAL DE NO HAY DATOS-->
      <div v-show="seeModal" class="modal">
        <div class="modalBox">
          <h3>No hay datos con los criterios de búsqueda</h3>

          <button @click="seeModal =! seeModal">Aceptar</button>
        </div>
      </div>
      <!---FIN CLASS MODAL--->

      <!---IMPORTAMOS EL COMPONENTE PARA LISTAR LAS PLAYAS
      ENVIAMOS DOS EVENTOS, UNO PARA COMENZAR UNA RESERVA Y OTRO PARA VER UNA PLAYA---->

      <searchbeachescomponent
        v-on:sendIdReserve="seeData"
        v-on:sendIdShow="showData"
        :beaches="beaches"
      />
    </div>
    <!------🔍-FIN ID LIST-BÚSQUEDA AVANZADA---->

    <!------📑-SECCIÓN DE INFO PRINCIPAL DE LA PLAYA--->
    <div id="info" v-show="info">
      <article id="up">
        <section id="data">
          <h1>INFORMACIÓN COMPLETA DE LA PLAYA</h1>
          <p>Id: {{beachId}}.Nombre: {{name}}, Municipio: {{municipality}}</p>
          <p>Provincia: {{province}}</p>
          <p>Tipo: {{type}}</p>
          <p>Descripción: {{description}}</p>
          <p>Capacidad: {{capacity}} personas</p>
          <p>Horario: de {{start_time}} a {{end_time}}</p>
          <p>Meses de reserva obligatoria: de {{nameMonth(start_month)}} a {{nameMonth(end_month)}}</p>
          <p>Valoración media de usuarios usuarios: {{voteAverage}}</p>
          <p>Servicios:</p>
          <p>Salvamento: {{lifesaving}}, Parking: {{parking}}, WC: {{toilet}}, Hostelería: {{bar_restaurant}}, Acceso minusv: {{disabled_access}}</p>

          <p class="error">{{errorMessageData}}</p>

          <img id="principal" :src="setImage(image)" />
          <button @click="comeback()">Volver al Buscador</button>
          <button @click="seeData(beachId)">Reservar</button>
        </section>

        <!-------📸-SECCIÓN DE FOTOS DE LA PLAYA HECHAS POR USUARIOS--->
        <section id="photos">
          <h2>Fotos de los usuarios</h2>

          <!--IMPORTAMOS COMPONENTE DE FOTOS--->
          <photoscomponent :photos="photos" />
          <p class="error">{{errorMessagePhotos}}</p>
        </section>
      </article>

      <article id="down">
        <!-------👍-SECCIÓN DE RATING Y OPINIONES--->
        <section id="rating">
          <h2>Valoraciones y comentarios de los usuarios</h2>

          <!--IMPORTAMOS COMPONENTE DE RATINGS--->

          <ratingscomponent :global="global" :votes="votes" />
          <p class="error">{{errorMessageVotes}}</p>
        </section>
      </article>
    </div>

    <!------📑-FIN SECCIÓN DE INFO PRINCIPAL DE LA PLAYA--->

    <!-------⌚-INICIO RESERVA--->
    <div id="reservation" v-show="reservation">
      <p>Playa: {{beachId}}</p>

      <!-------FECHA Y Nº DE PLAZAS A RESERVAR--->
      <section id="dateplaces">
        <p>Fecha:</p>
        <input id="date" type="date" v-model="dateReservation" placeholder="fecha" />

        <p>Hora (formato 24 horas):</p>
        <select id="hour" v-model="hourReservation">
          <option v-for="number in numbers" :key="number.id" :value="number">{{number}}</option>
        </select>

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
        <!-------CONFIRMACIÓN DE LA RESERVA--->
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

      <ul class="ok" id="reserv" v-show="reservInfo">
        <li>{{messageConfirm.info}}</li>
        <li>{{messageConfirm.user}}</li>
        <li>{{messageConfirm.beach}}</li>
        <li>{{messageConfirm.visit}}</li>
        <li>{{messageConfirm.places}}</li>
        <li>{{messageConfirm.fee}}</li>
        <li>{{messageConfirm.payment}}</li>
        <li>{{messageConfirm.notice}}</li>
      </ul>

      <!----<p class="error" id="reserv" v-show="notice">{{errorMessage}}</p>--->
      <button v-show="pending" @click="acceptReservation">Aceptar</button>

      <button @click="comeback()">Volver</button>
    </div>

    <!-------⌚-FIN RESERVA--->
  </div>
</template>

<script>
import axios from "axios";

import searchbeachescomponent from "../../components/beachcomponents/Searchbeachescomponent.vue";
import photoscomponent from "../../components/beachcomponents/Photoscomponent.vue";
import ratingscomponent from "../../components/beachcomponents/Ratingscomponent.vue";
import {
  getAuthToken,
  getId,
  setServices,
  sweetAlertNotice,
} from "../../api/utils";
export default {
  name: "Advancedsearch",
  components: {
    searchbeachescomponent,
    photoscomponent,
    ratingscomponent,
  },
  data() {
    return {
      beaches: [],
      order: "",
      direction: "",
      list: true,
      advanced: false,
      info: false,
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
      errorMessageData: "",
      errorMessageVotes: "",
      errorMessagePhotos: "",
      reservInfo: false,
      pending: "true",
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

    //FUNCIÓN PARA  VOLVER DEL BUSCADOR, QUE BORRE EL AVISO DE LA RESERVA
    //Y QUE SE GUARDEN LAS OPCIONES DEL BUSCADOR
    comeback() {
      console.log("antes");
      //location.reload();
      //console.log("reload");
      //BORRAR FOTOS Y VOTOS Y MENSAJES DE LA PLAYA QUE ACABA DE MOSTRAR (SI NO, APARECE LO DEL ANTERIOR):
      this.votes = [];
      this.photos = [];
      this.errorMessageVotes = "";
      this.errorMessagePhotos = "";
      //PARA QUE OCULTE LA INFO DE LA PLAYA Y VUELVA A LA LISTA
      this.reservation = false;
      this.notice = false;
      this.info = false;
      this.list = true;
      //PARA QUE GUARDE LAS OPCIONES QUE SELECCIONÓ EL USUARIO ANTES DE PASAR DE PANTALLA
      this.lifesaving = this.lifesavingSaved;
      this.bar_restaurant = this.bar_restaurantSaved;
      this.disabled_access = this.disabled_accessSaved;
      this.parking = this.parkingSaved;
      this.toilet = this.toiletSaved;
      console.log("final");
    },

    //FUNCIÓN PARA VER LOS DATOS DE UNA PLAYA
    async showData(beachId) {
      this.list = false;
      this.info = true;
      this.reservation = false;
      try {
        const response = await axios.post(
          `http://localhost:3000/beaches/${beachId}/show`,
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
        this.errorMessageData = error.response.data.message;
      }
      this.seeVotes(beachId);
      this.seePhotos(beachId);
    },

    //FUNCIÓN PARA COMENZAR LA RESERVA

    seeData(beachId) {
      const idUser = getId();
      if (idUser === null) {
        this.$router.push("/login"); //SI NO ESTÁ LOGEADO, LO MANDA AL LOGIN
      } else {
        this.list = false;
        this.info = false;
        this.reservation = true;
        //SE GENERAN LAS HORAS
        this.getNumber();
        //SI HAY FECHA, HORA Y PLAZAS EN EL BUSCADOR, SE PASAN A LA RESERVA (SE PUEDEN CAMBIAR)
        this.dateReservation = this.date;
        this.hourReservation = this.hour;
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

        if (!this.dateReservation || !this.hourReservation) {
          this.sweetAlertNotice("Debes indicar fecha y hora");
          const error = new Error();
          throw error;
        }
        this.visitReservation = this.getVisit(
          this.dateReservation,
          this.hourReservation
        );
        console.log(this.visitReservation);

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
        this.reservInfo = true;
        this.pending = false;
        this.messageConfirm = response.data.message;
        //UNA VEZ ACEPTADA, VACIAMOS LOS CAMPOS
        this.dateReservation = "";
        this.hourReservation = "";
        this.placesReservation = "";
        this.ccNumber = "";
      } catch (error) {
        //this.notice = true;
        //this.errorMessage = error.response.data.message;
        sweetAlertNotice(error.response.data.message);
      }
    },

    //FUNCIÓN PARA BUSCAR PLAYAS
    async searchBeaches() {
      let visit = this.getVisit(this.date, this.hour);

      this.info = false;
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

ul#reserv {
  background-color: #ebecf1;
  list-style: none;
  width: 50%;
  margin: auto;
}

li {
  margin-bottom: 1rem;
}
</style>