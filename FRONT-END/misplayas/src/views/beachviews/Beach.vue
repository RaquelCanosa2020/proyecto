<template>
  <div class="beach">
    <vue-headful title="misplayas | Playa" />
    <section id="data">
      <h1>INFORMACIÓN COMPLETA DE LA PLAYA</h1>
      <p>Id: {{$route.params.id}}.Nombre: {{name}}, Municipio: {{municipality}}</p>
      <p>Provincia: {{province}}</p>
      <p>Tipo: {{type}}</p>
      <p>Descripción: {{description}}</p>
      <p>Capacidad: {{capacity}} personas</p>
      <p>Hora inicio: {{start_time}}</p>
      <p>Hora fin: {{end_time}}</p>
      <p>Mes inicio: {{start_month}}</p>
      <p>Mes fin: {{end_month}}</p>
      <p>Valoración media de usuarios usuarios: {{voteAverage}}</p>
      <p>Servicios:</p>
      <p>Salvamento: {{lifesaving}}, Parking: {{parking}}, WC: {{toilet}}, Hostelería: {{bar_restaurant}}, Acceso minusv: {{disabled_access}}</p>
    </section>
    <input
      id="datetime"
      type="datetime-local"
      step="3600"
      v-model="visitReservation"
      placeholder="fecha y hora"
    />
    <section id="select">
      <p>Número de plazas:</p>
      <select v-model="placesReservation">
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
      </select>
    </section>
    <button @click="showData(id)">Buscar disponibilidad</button>

    <p>{{disponibilidad}}</p>
    <p>{{aviso}}</p>

    <router-link to="/" tag="button">Volver a Playas</router-link>
    <router-link to="/search" tag="button">Volver al Buscador</router-link>

    <button @click="verDatos()">Reservar</button>
    <section id="reservation" v-show="reservation">
      <p>
        Condiciones generales de la reserva:
        ........
      </p>
      <p>Id usuario</p>
      <p>Nombre</p>
      <p>Número de tarjeta de crédito</p>
      <p>Importe: 3 euros (impuestos incluídos)</p>

      <button @click="fecha">Confirmar y pagar</button>
      <button @click="reservation = false">cancelar</button>
    </section>

    <p>Confirmation</p>
  </div>
</template>

<script>
import axios from "axios";

import { setServices, getAuthToken, getId } from "../../api/utils";

//import beachcomponent from "@/components/beachcomponents/Beachcomponent.vue";

export default {
  name: "beach",
  components: {
    // beachcomponent,
  },

  data() {
    return {
      //beach: {},
      id: null,
      visit: "",
      visitReservation: "",
      places: "",
      placesReservation: "",
      beachId: "",
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
      aviso: "",
      visitFormat: "",
      reservation: false,
    };
  },
  methods: {
    //FUNCIÓN PARA OBTENER EL ID DEL USUARIO

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
        this.occupation = beachData.occupation;
        this.disponibilidad = response.data.data.disponibilidad;
        this.aviso = response.data.data.aviso;
      } catch (error) {
        console.log(error);
      }
    },

    verDatos() {
      this.reservation = true;
      console.log(this.visit, this.places);
      this.visitReservation = this.visit;
      this.placesReservation = this.places;
      console.log(this.visit, this.places);
    },

    fecha() {
      console.log(this.visit);
      this.reservation = false;
    },
  },
  created() {
    this.showData();
  },
};
</script>
<style scoped>
div.beach {
  height: 100vh;
}
</style>