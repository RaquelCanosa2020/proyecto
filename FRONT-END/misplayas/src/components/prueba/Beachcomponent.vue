<template>
  <div>
    <div>
      <p>{{beach.id}}</p>
      <p>{{beach.name}}, {{beach.municipality}}</p>
      <p>{{beach.province}}</p>

      <button @click="seeBeach">Ver</button>
      <button @click="toggleReserv">Reservar</button>

      <div v-show="see">
        <p>Id: {{beach.id}}.Nombre: {{beach.name}}, Municipio: {{beach.municipality}}</p>
        <p>Provincia: {{beach.province}}</p>
        <p>Tipo: {{beach.type}}</p>
        <p>Descripción: {{beach.description}}</p>
        <p>Capacidad: {{beach.capacity}} personas</p>
        <p>Hora inicio: {{beach.start_time}}</p>
        <p>Hora fin: {{beach.end_time}}</p>
        <p>Mes inicio: {{beach.start_month}}</p>
        <p>Mes fin: {{beach.end_month}}</p>
        <p>Valoración media de usuarios usuarios: {{beach.voteAverage}}</p>
        <p>Servicios:</p>
        <p>
          Salvamento: {{beach.lifesaving}}, Parking: {{beach.parking}}, WC: {{beach.toilet}},
          Hostelería: {{beach.bar_restaurant}}, Acceso minusv: {{beach.disabled_access}}
        </p>
        <p>{{beach.disponibilidad}}</p>
        <p>{{beach.aviso}}</p>
        <button @click="see = false">Volver</button>
      </div>

      <div v-show="reserv">
        <input
          id="datetime"
          type="datetime-local"
          step="3600"
          v-model="visit"
          placeholder="fecha y hora"
        />

        <input type="text" placeholder="nº plazas" v-model="places" />
        <input type="text" placeholder="nºtarjeta" v-model="ccNumber" />

        <button @click="confirm">Confirmar y pagar</button>
      </div>
    </div>
  </div>
</template>


<script>
import axios from "axios";
import { setServices } from "../../api/utils";
export default {
  name: "Beachcomponent",
  props: {
    beach: Object,
    visit: String,
    places: Number,
  },
  data() {
    return {
      see: false,
      reserv: false,
      visitReserve: "",
      placesReserve: "",
      ccNumber: "",
    };
  },

  methods: {
    async seeBeach() {
      this.see = true;
      const id = this.beach.id;

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

        this.beach.id = beachData.id;
        this.beach.name = beachData.name;
        this.beach.municipality = beachData.municipality;
        this.beach.province = beachData.province;
        this.beach.description = beachData.description;
        this.beach.type = beachData.type;
        this.beach.capacity = beachData.capacity;
        this.beach.start_time = beachData.start_time;
        this.beach.end_time = beachData.end_time;
        this.beach.start_month = beachData.start_month;
        this.beach.end_month = beachData.end_month;
        this.beach.voteAverage = beachData.voteAverage;
        this.beach.lifesaving = setServices(beachData.lifesaving);
        this.beach.parking = setServices(beachData.parking);
        this.beach.toilet = setServices(beachData.toilet);
        this.beach.bar_restaurant = setServices(beachData.bar_restaurant);
        this.beach.disabled_access = setServices(beachData.disabled_access);

        this.beach.disponibilidad = response.data.data.disponibilidad;
        this.beach.aviso = response.data.data.aviso;
      } catch (error) {
        console.log(error);
      }
    },
    async confirm() {
      const id = this.beach.id;
      alert(
        `reserva para la playa ${id} en fecha ${this.visit}, ${this.places}. Tarjeta: ${this.ccNumber}`
      );

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
      } catch (error) {
        console.log(error);
      }
    },

    toggleReserv() {
      this.reserv = !this.reserv;
      this.see = false;
    },
  },
};
</script>