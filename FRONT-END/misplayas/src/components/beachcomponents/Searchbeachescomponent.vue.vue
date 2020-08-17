<template>
  <div>
    <div>
      <!--V-FOR PARA LISTAR LAS PLAYAS EN EL BUSCADOR---->
      <input type="search" v-model="search" placeholder="Busca por palabras" />
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

        <!--BOTONES CON EVENTOS PARA LA VISTA, ENVÍAN EL ID DE LA PLAYA A VER O RESERVAR---->

        <button @click="sendBeachIdToShow(index)">Ver</button>
        <button @click="sendBeachIdToReserve(index)">Reservar</button>

        <!--- <button>
          <router-link :to="{name:'Playa', params: {id:beach.id}}">+ info</router-link>
        </button>-
        CAMBIO DE LA ED.O, NO ENVIAMOS A UNA NUEVA VISTA SI NO A ADVANCEDSEARCH
        SI NO TENGO PROBLEMAS PARA TENER DISPONIBLES LOS DATOS-->
      </section>
    </div>
  </div>
</template>


<script>
export default {
  name: "Searchbeachescomponent",
  props: {
    beaches: Array,
  },
  data() {
    return {
      search: "",
    };
  },
  computed: {
    //BUSCADOR POR PALABRAS
    filtered() {
      if (!this.search) {
        //si search está vacío, devuelve beaches tal cual
        return this.beaches;
      }
      return this.beaches.filter(
        (item) =>
          item.name.toLowerCase().includes(this.search.toLowerCase()) ||
          item.municipality.toLowerCase().includes(this.search.toLowerCase()) ||
          item.province.toLowerCase().includes(this.search.toLowerCase()) ||
          item.description.toLowerCase().includes(this.search.toLowerCase())
      );
    },
  },
  methods: {
    //FUNCIÓN PARA SACAR LA DIRECCIÓN DE LA IMAGEN ACTUAL
    setImage(img) {
      return process.env.VUE_APP_STATIC + img;
    },

    //FUNCIÓN PARA ENVIAR EL ID DE LA PLAYA PARA MOSTRAR DATOS COMPLETOS

    sendBeachIdToShow(index) {
      let beachId = this.beaches[index].id;
      //console.log(beachId);
      this.$emit("sendIdShow", beachId);
    },

    //FUNCIÓN PARA ENVIAR EL ID DE LA PLAYA PARA COMENZAR UNA RESERVA

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