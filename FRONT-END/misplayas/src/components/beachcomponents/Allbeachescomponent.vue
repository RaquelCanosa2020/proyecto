<template>
  <div>
    <div>
      <input type="search" v-model="search" placeholder="Busca por nombre" />
      <!--pendiente orden---->
      <section v-for="(beach,index) in filtered" :key="beach.id">
        <p>{{beach.id}}</p>
        <p>{{beach.name}}, {{beach.municipality}}</p>
        <p>{{beach.province}}</p>
        <p>{{beach.description}}</p>
        <p>Capacidad: {{beach.capacity}} personas</p>
        <p>Valoración media de usuarios: {{beach.voteAverage}}</p>

        <!----  <button>
          <router-link :to="{name:'Home', params:{id:beach.id}}">Reservar</router-link>
        </button>--->

        <button @click="sendIdToShow(index)">Ver</button>
        <button @click="toggleReserv">Reservar</button>

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

          <button @click="sendIdToConfirm(index)">Confirmar</button>-
        </div>
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
      confirm: false,
      reserv: false,
      beachId: null,
      visit: "",
      places: null,
      ccNumber: "",
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
    sendIdToShow(index) {
      let beachId = this.beaches[index].id;
      //console.log(beachId);
      this.$emit("sendShow", beachId);
    },
    toggleReserv() {
      this.reserv = !this.reserv;
      // this.see = false;
    },

    sendIdToConfirm(index) {
      let reservData = this.beaches[index];

      this.$emit("sendConfirm", reservData);
    },
  },
};
</script>