<template>
  <div>
    <div>
      <input type="search" v-model="search" placeholder="Busca por nombre" />
      <!--pendiente orden---->
      <section v-for="beach in filtered" :key="beach.id">
        <p>{{beach.id}}</p>
        <p>{{beach.name}}, {{beach.municipality}}</p>
        <p>{{beach.province}}</p>
        <p>{{beach.description}}</p>
        <p>Capacidad: {{beach.capacity}} personas</p>
        <p>Valoración media de usuarios: {{beach.voteAverage}}</p>

        <!---<button @click="sendBeachId(index)">Ver</button>--->
        <button>
          <router-link :to="{name:'Playa', params:{id:beach.id}}">Ver</router-link>
        </button>
      </section>
    </div>
  </div>
</template>


<script>
export default {
  name: "Allbeachescomponent",
  props: {
    beaches: Array,
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
    sendBeachId(index) {
      let beachId = this.beaches[index].id;
      //console.log(beachId);
      this.$emit("sendId", beachId);
    },
  },
};
</script>