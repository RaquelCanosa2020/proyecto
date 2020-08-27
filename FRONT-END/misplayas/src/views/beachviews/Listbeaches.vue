<template>
  <div class="home">
    <vue-headful title="misplayas | Lista Playas" />

    <h1>Listado de playas del Administrador</h1>
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

    <allbeachescomponent v-on:sendToggle="toggleBeach" :beaches="beaches" />
  </div>
  <!---FIN ID LIST----->
</template>

<script>
//import HelloWorld from '@/components/HelloWorld.vue'
import axios from "axios";
import allbeachescomponent from "../../components/beachcomponents/Allbeachescomponent.vue";
import {
  setServices,
  getAuthToken,
  getId,
  sweetAlertNotice,
} from "../../api/utils";

export default {
  name: "Listbeaches",
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
      lifesaving: false,
      parking: false,
      toilet: false,
      bar_restaurant: false,
      disabled_access: false,
      image: "",
    };
  },
  methods: {
    //FUNCIÓN PARA CONSEGUIR LAS PLAYAS
    async getBeaches() {
      const token = getAuthToken();

      axios.defaults.headers.common["Authorization"] = `${token}`;

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
    async toggleBeach(beachId) {
      const token = getAuthToken();

      axios.defaults.headers.common["Authorization"] = `${token}`;

      try {
        const response = await axios.delete(
          `http://localhost:3000/beaches/${beachId}`
        );
        alert(response.data.message);

        this.beaches = response.data.data;
        location.reload();
      } catch (error) {
        sweetAlertNotice(error.response.data.message);
      }
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
