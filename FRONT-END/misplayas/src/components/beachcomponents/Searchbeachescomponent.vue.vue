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
        <p>Valoración media de usuarios: {{beach.voteAverage}}</p>

        <!---<button>
          <router-link :to="{name:'Playa', params:{id:beach.id}}">Ver</router-link>
        </button>--->

        <button @click="sendBeachIdToShow(index)">Ver</button>
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
    sendBeachIdToShow(index) {
      let beachId = this.beaches[index].id;
      //console.log(beachId);
      this.$emit("sendIdShow", beachId);
    },
    sendBeachIdToReserve(index) {
      let beachId = this.beaches[index].id;
      //console.log(beachId);
      this.$emit("sendIdReserve", beachId);
    },
  },
};
</script>