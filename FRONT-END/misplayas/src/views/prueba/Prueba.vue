<template>
  <div>
    <!---INICIO PANTALLA BÚSQUEDA AVANZADA-->
    <div id="list" v-show="list">
      <h1>BUSCA TU PLAYA</h1>
      <section id="order">
        <div>
          <p>Ordenar por:</p>
          <select v-model="order">
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

      <article id="advanced">
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

        <section id="options">
          <label>Salvamento</label>
          <input type="checkbox" value="lifesaving" v-model="lifesaving" />

          <label>Hostelería</label>
          <input type="checkbox" value="bar_restaurant" v-model="bar_restaurant" />

          <label>Acceso d.funcional</label>
          <input type="checkbox" value="disabled_access" v-model="disabled_access" />

          <label>Parking</label>
          <input type="checkbox" value="parking" v-model="parking" />

          <label>WC</label>
          <input type="checkbox" value="toilet" v-model="toilet" />
        </section>
      </article>
      <!--FIN BUSCADOR AVANZADO--->

      <button @click="searchBeaches()">Buscar</button>

      <!----INICIO MOSTRAR DATOS DE LA PLAYA--->

      <!----MODAL DE NO HAY DATOS-->
      <div v-show="seeModal" class="modal">
        <div class="modalBox">
          <h3>No hay datos con los criterios de búsqueda</h3>

          <button @click="seeModal =! seeModal">Aceptar</button>
        </div>
      </div>
      <!---FIN CLASS MODAL--->

      <listcomponent :beaches="beaches" />
    </div>
  </div>
</template>

<script>
import axios from "axios";
import listcomponent from "@/components/prueba/Listcomponent.vue";
import { setServices } from "../../api/utils";

export default {
  name: "Prueba",
  components: {
    listcomponent,
  },
  data() {
    return {
      beaches: [],
      visit: "",
      places: null,
      order: "",
      direction: "",
      list: true,
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
      bar_restaurant: false,
      disabled_access: false,
      parking: false,
      toilet: false,
      disponibilidad: "",
      aviso: "",
      ccNumber: "",
      messageConfirm: "",
    };
  },
  methods: {
    async searchBeaches() {
      console.log(this.visit);

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
          }
        );
        this.beaches = response.data.data;
      } catch (error) {
        console.log(error);
        this.seeModal = true;
      }
    },

    confirm(data) {
      console.log(data);
    },
  },
  created() {
    this.searchBeaches();
  },
};
</script>
<style scoped>
input#datetime {
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
</style>