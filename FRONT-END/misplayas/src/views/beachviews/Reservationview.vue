<template>
  <div class="reservation">
    <!-------⌚-INICIO RESERVA-->
    <label>Elige la playa:</label>
    <select v-model="selectedBeach">
      <option
        v-for="beach in beaches"
        :key="beach.id"
        :value="beach.id"
      >{{beach.id}}, {{beach.name}}, {{beach.municipality}}, {{beach.province}}</option>
    </select>

    <!-------<p>Playa: Nº.{{$route.params.id}}, {{$route.params.name}}</p>
    <p>Municipio: {{$route.params.municipality}}, Provincia: {{$route.params.province}}</p>--->

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
      <input id="ccNumber" type="text" v-model="ccNumber" placeholder="Nº tarjeta crédito/débito" />

      <p>Importe: 3 euros (impuestos incluídos)</p>
    </section>

    <ul class="ok" id="reserv">
      <li>{{messageConfirm.info}}</li>
      <li>{{messageConfirm.user}}</li>
      <li>{{messageConfirm.beach}}</li>
      <li>{{messageConfirm.visit}}</li>
      <li>{{messageConfirm.places}}</li>
      <li>{{messageConfirm.fee}}</li>
      <li>{{messageConfirm.payment}}</li>
      <li>{{messageConfirm.notice}}</li>
    </ul>

    <button v-show="beforeConfirm" @click="acceptReservation">Confirmar y pagar</button>

    <button>
      <router-link :to="{name:'Buscador', params:{info:this.info}}">Volver</router-link>
    </button>

    <!-------⌚-FIN RESERVA--->
  </div>
</template>

<script>
import axios from "axios";
import spinner from "@/components/Spinner.vue";
import onebeachcomponent from "@/components/beachcomponents/Onebeachcomponent.vue";

import {
  getAuthToken,
  getId,
  sweetAlertNotice,
  sweetAlertOk,
} from "../../api/utils";

export default {
  name: "Reserva",
  components: {
    spinner,
    onebeachcomponent,
  },
  props: {
    //data: Object, // datos playa, intento pasar evento pero no funciona
    info: Object, //datos opciones buscador, sí funciona desde App
  },

  data() {
    return {
      beaches: [],
      selectedBeach: "",
      id: null,
      visit: "",
      visitReservation: "",
      places: "",
      placesReservation: "",
      name: "",
      municipality: "",
      province: "",
      ccNumber: "4539054178358254",
      messageConfirm: {},
      date: "",
      dateReservation: "",
      hourReservation: "",
      hour: "",
      numbers: [],
      spinner: true,
      beforeConfirm: false,
    };
  },
  computed: {
    //FUNCIÓN PARA CONSEGUIR VISIT A PARTIR DE FECHA Y HORA QUE INTRODUZCA EL USUARIO
    getVisit() {
      let datehour = "";

      if (this.dateReservation === "" || this.hourReservation === "") {
        datehour = "";
      } else {
        datehour =
          this.dateReservation + "T" + this.hourReservation + ":" + "00";
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

      //SI HAY FECHA, HORA Y PLAZAS EN EL BUSCADOR, SE PASAN A LA RESERVA (SE PUEDEN CAMBIAR)
      this.dateReservation = this.info.date;
      this.hourReservation = this.info.hour;
      this.placesReservation = this.info.places;
      if (this.$route.params.id) {
        this.selectedBeach = this.$route.params.id;
      } else {
        this.selectedBeach = null;
      }
      //this.id = this.data.id;
      //this.name = this.data.name;
      //this.municipality = this.data.municipality;
      //this.province = this.data.province;
    },

    //FUNCIÓN PARA CONSEGUIR LOS DATOS DE LAS PLAYAS (SI USUARIO NO VIENE DEL BUSCADOR)
    async getBeaches() {
      try {
        const response = await axios.get(`http://localhost:3000/beaches`);

        this.beaches = response.data.data;
      } catch (error) {
        this.errorMessage = error.response.data.message;
      }
    },
    //FUNCIÓN PARA COMENZAR LA RESERVA

    seeData(beachData) {
      const idUser = getId();
      if (idUser === null) {
        this.$router.push("/login"); //SI NO ESTÁ LOGEADO, LO MANDA AL LOGIN
      } else {
        this.beforeConfirm = true;
        //SE GENERAN LAS HORAS
        this.getNumber();
      }
    },

    //FUNCIÓN PARA PAGAR Y CONFIRMAR LA RESERVA

    async acceptReservation() {
      try {
        const idUser = getId();
        console.log(idUser);
        const token = getAuthToken();

        if (!this.dateReservation || !this.hourReservation) {
          sweetAlertNotice("Debes indicar fecha y hora");
        } else {
          this.visitReservation = this.getVisit;

          axios.defaults.headers.common["Authorization"] = `${token}`;
          const response = await axios.post(
            "http://localhost:3000/reservations",
            {
              visit: this.visitReservation,
              places: this.placesReservation,
              id_beach: this.selectedBeach,
              cc_number: this.ccNumber,
            }
          );

          this.messageConfirm = response.data.message;

          //UNA VEZ ACEPTADA, VACIAMOS LOS CAMPOS
          this.dateReservation = "";
          this.hourReservation = "";
          this.placesReservation = "";
          this.ccNumber = "";
          this.beforeConfirm = false;
        }
      } catch (error) {
        sweetAlertNotice(error.response.data.message);
        //console.log(error);
      }
    },
  },
  created() {
    this.getBeaches();
    this.seeData();
  },
};
</script>
