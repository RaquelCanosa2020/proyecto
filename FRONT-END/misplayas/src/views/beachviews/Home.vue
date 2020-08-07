<template>
  <div class="home">
    <vue-headful title="misplayas | Home" />

    <img src="https://image.flaticon.com/icons/svg/3075/3075404.svg" />

    <!--SELECT PARA ELEGIR POR QUÉ SELECCIONAR-->
    <div id="list" v-show="list">
      <h1>PLAYAS</h1>
      <section>
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

      <allbeachescomponent v-on:sendId="showData" :beaches="beaches" />
    </div>
    <!---FIN ID LIST----->

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

      <button @click="getBeaches()">Volver</button>
    </div>
    <!---FIN ID SELECTED----->
  </div>
</template>

<script>
//import HelloWorld from '@/components/HelloWorld.vue'
import axios from "axios";
import allbeachescomponent from "../../components/beachcomponents/Allbeachescomponent.vue";
import { setServices } from "../../api/utils.js";

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
      parking: "",
      toilet: "",
      bar_restaurant: "",
      disabled_access: "",
      votes: [],
      rating: "",
      seeVotes: false,
      photos: [],
      seePhotos: false,
    };
  },
  methods: {
    //FUNCIÓN PARA CONSEGUIR LAS PLAYAS
    async getBeaches() {
      this.selected = false;
      this.list = true;
      //var self = this;
      //LLAMADA DE AXIOS A LA API

      try {
        const response = await axios.get(
          `http://localhost:3000/beaches?order=${this.order}&direction=${this.direction}`
        );
        /*.then(function (response) {
          self.beaches = response.data.data;
        })*/
        this.beaches = response.data.data;
      } catch (error) {
        console.log(error);
      }

      /* .catch(function (error) {
          console.log(error);
        });
      console.log(this.order);
      console.log(this.direction);*/
    },
    //FUNCIÓN PARA CONSEGUIR LOS DATOS DE UNA PLAYA:
    async showData(beachId) {
      console.log(beachId);
      //const id = showId(beachId);

      try {
        this.list = false;
        this.selected = true;

        const response = await axios.post(
          `http://localhost:3000/beaches/${beachId}/show`
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
      } catch (error) {
        console.log(error);
      }
    },
  },
  created() {
    this.getBeaches();
  },
};
</script>

<style scoped>
section {
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
