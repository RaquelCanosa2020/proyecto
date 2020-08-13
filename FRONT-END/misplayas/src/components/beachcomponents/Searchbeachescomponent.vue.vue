<template>
  <div>
    <div>
      <input type="search" v-model="search" placeholder="Busca por nombre" />
      <section v-for="(beach,index) in filtered" :key="beach.id">
        <p>{{beach.id}}</p>
        <p>{{beach.name}}, {{beach.municipality}}</p>
        <p>{{beach.province}}</p>
        <p>Descripción: {{beach.description}}</p>
        <p>Capacidad: {{beach.capacity}} personas</p>
        <p>Disponibilidad en fecha y hora indicada: {{beach.free}} plazas</p>
        <p>
          Valoración media de usuarios:
          <button id="rating">{{beach.voteAverage}}</button>
        </p>
        <img :src="setImage(beach.image)" />

        <!--- <button>
          <router-link :to="{name:'Playa', params:{id:beach.id, visit:beach.visit}}">A la playa</router-link>
        </button>--->

        <!---<button @click="sendBeachIdToShow(index)">Ver</button>-->

        <button>
          <router-link :to="{name:'Playa', params: {id:beach.id}}">+ info</router-link>
        </button>

        <button @click="sendBeachIdToReserve(index)">Reservar</button>
      </section>
    </div>
  </div>
</template>


<script>
export default {
  name: "Searchbeachescomponent",
  props: {
    beaches: Array,
    visit: String,
    places: Number,
  },
  data() {
    return {
      search: "",
    };
  },
  computed: {
    filtered() {
      if (!this.search) {
        //si search está vacío, devuelve beaches tal cual
        return this.beaches;
      }
      return this.beaches.filter((item) =>
        item.name.toLowerCase().includes(this.search.toLowerCase())
      );
    },
  },
  methods: {
    //FUNCIÓN PARA SACAR LA DIRECCIÓN DE LA IMAGEN ACTUAL
    setImage(img) {
      return process.env.VUE_APP_STATIC + img;
    },

    sendBeachIdToReserve(index) {
      let beachId = this.beaches[index].id;
      //console.log(beachId);
      this.$emit("sendIdReserve", beachId);
    },
  },
};
</script>
<style scoped>
section {
  background-color: #ebecf1;
  margin-bottom: 1rem;
}
img {
  width: 200px;
}
button#rating {
  width: 50px;
  height: 50px;
  background-color: #4cbbb9;

  border: none;
  border-radius: 20%;
  color: #353a64;
  font-size: 1.5rem;
  font-weight: bold;
}
</style>