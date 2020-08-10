<template>
  <div class="home">
    <vue-headful title="misplayas | Home" />

    <img src="https://image.flaticon.com/icons/svg/3075/3075404.svg" />

    <!--SELECT PARA ELEGIR POR QUÉ SELECCIONAR-->
    <div id="list" v-show="list">
      <h1>PLAYAS</h1>
      <section id="list">
        <div>
          <p>Ordenar por:</p>
          <select v-model="order">
            <option value="voteAverage">Valoración</option>
            <option value="municipality">Municipio</option>
            <option value="province">Provincia</option>
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

      <button @click="getBeaches()">Ordenar</button>

      <allbeachescomponent
        v-on:sendShow="showData"
        v-on:sendConfirm="confirmReservation"
        :beaches="beaches"
      />
    </div>
    <!---FIN ID LIST----->

    <section id="selected" v-show="selected">
      <h1>INFORMACIÓN COMPLETA DE LA PLAYA</h1>
      <p>Id: {{beachId}}.Nombre: {{name}}, Municipio: {{municipality}}</p>
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

      <button @click="getBeaches()">Volver</button>
    </section>

    <article id="reservation" v-show="reservation">
      <section id="dateplaces">
        <input
          id="datetime"
          type="datetime-local"
          step="3600"
          v-model="visit"
          placeholder="fecha y hora"
        />

        <p>Número de plazas:</p>
        <select v-model="places">
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
      </section>
      <button @click="showData(beachId)">Buscar disponibilidad</button>
      <p>{{disponibilidad}}</p>

      <!---<section id="conditions">
        <p>Condiciones generales de la reserva:</p>
        <p>Id playa {{beachId}}</p>
        <p>Nombre</p>
        <p>Número de tarjeta de crédito</p>
        <p>Importe: 3 euros (impuestos incluídos)</p>
      </section>
      <button @click="confirmReservation">Confirmar y pagar</button>
      <button @click="reservation = false, list = true">Cancelar</button>
      <p>Confirmation</p>--->
    </article>

    <!---FIN ID SELECTED----->
  </div>
</template>

<script>
//import HelloWorld from '@/components/HelloWorld.vue'
import axios from "axios";
import allbeachescomponent from "../../components/beachcomponents/Allbeachescomponent.vue";
import { setServices, getAuthToken, getId } from "../../api/utils";

export default {
  name: "Home",
  components: {
    allbeachescomponent,
  },
  data() {
    return {
      beaches: [],
      order: "",
      direction: "",
      list: true,
      selected: false,
      reservation: false,
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
      visit: "",

      places: "",

      lifesaving: false,
      parking: false,
      toilet: false,
      bar_restaurant: false,
      disabled_access: false,
      disponibilidad: "",
      aviso: "",
      visitFormat: "",
    };
  },
  methods: {
    //FUNCIÓN PARA CONSEGUIR LAS PLAYAS
    async getBeaches() {
      this.selected = false;
      this.list = true;

      try {
        const response = await axios.get(
          `http://localhost:3000/beaches?order=${this.order}&direction=${this.direction}`
        );
        console.log(response.data);

        this.beaches = response.data.data;
      } catch (error) {
        console.log(error);
      }
    },
    //FUNCIÓN PARA CONSEGUIR LOS DATOS DE UNA PLAYA:
    async showData(beachId) {
      console.log(beachId);

      try {
        this.list = false;
        this.reservation = false;
        this.selected = true;

        const response = await axios.post(
          `http://localhost:3000/beaches/${beachId}/show`,
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
        this.disponibilidad = response.data.data.disponibilidad;
        this.aviso = response.data.data.aviso;
      } catch (error) {
        console.log(error);
      }
    },
    /*reserve(beachId) {
      this.list = false;
      this.selected = false;
      this.reservation = true;
      console.log(this.visit, this.places);
      this.visitReservation = this.visit;
      this.placesReservation = this.places;
      console.log(this.visit, this.places);
    },*/

    confirmReservation(reservData) {
      this.places = reservData.places;
      console.log(beachId);
    },
  },
  created() {
    this.getBeaches();
  },
};
</script>

<style scoped>
section:not(#selected) {
  display: flex;
  justify-content: center;
}

img {
  width: 100px;
}

select {
  width: 200px;
  height: 25px;
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
</style>
