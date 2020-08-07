<template>
  <div class="home">
    <vue-headful title="misplayas | Buscador" />

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

      <button @click="advanced =! advanced">AVANZADO</button>
      <article v-show="advanced">
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

      <br />
      <button @click="searchBeaches()">Buscar</button>

      <!----MODAL DE NO HAY DATOS-->
      <div v-show="seeModal" class="modal">
        <div class="modalBox">
          <h3>No hay datos con los criterios de búsqueda</h3>

          <button @click="seeModal =! seeModal">Aceptar</button>
        </div>
      </div>
      <!---FIN CLASS MODAL--->

      <searchbeachescomponent v-on:sendId="showData" :beaches="beaches" />
    </div>
    <!---FIN ID LIST-BÚSQUEDA AVANZADA---->

    <div id="selected" v-show="selected">
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

      <p>{{disponibilidad}}</p>

      <button @click="searchBeaches()">Volver</button>
    </div>
    <!---FIN ID SELECTED----->
  </div>
</template>

<script>
import axios from "axios";
import searchbeachescomponent from "../../components/beachcomponents/Searchbeachescomponent.vue";
import { setServices } from "../../api/utils.js";
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
      seeModal: false,
      visit: "",
      places: "",
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
    };
  },
  methods: {
    //FUNCION PARA PROCESAR opciones

    //FUNCIÓN PARA BUSCAR PLAYAS
    async searchBeaches() {
      console.log(this.visit);
      this.selected = false;

      this.list = true;

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
    async showData(beachId) {
      console.log(beachId);
      //const id = showId(beachId);

      try {
        this.list = false;
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
        this.occupation = beachData.occupation;
        this.disponibilidad = response.data.data.disponibilidad;
        this.aviso = response.data.data.aviso;
      } catch (error) {
        console.log(error);
      }
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