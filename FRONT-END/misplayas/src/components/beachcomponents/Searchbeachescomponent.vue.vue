<template>
  <div>
    <div>
      <!--V-FOR PARA LISTAR LAS PLAYAS EN EL BUSCADOR---->
      <input type="search" v-model="search" placeholder="Busca por palabras" />
      <section v-for="(beach,index) in filtered" :key="beach.id">
        <div id="left">
          <p>{{beach.id}}</p>
          <p>{{beach.name}}, {{beach.municipality}}</p>
          <p>{{beach.province}}</p>
          <p>Descripción: {{beach.description}}</p>
          <p>Capacidad: {{beach.capacity}} personas</p>

          <!----En caso de que se indique fecha, muestra la disponibilidad------>
          <p
            :class="{hidden: !beach.free }"
          >Disponibilidad en fecha y hora indicada: {{beach.free}} plazas</p>
          <p>
            Valoración media de usuarios:
            <button id="rating">{{beach.voteAverage}}</button>
          </p>

          <!--BOTONES CON EVENTOS PARA LA VISTA, ENVÍAN EL ID DE LA PLAYA A VER O RESERVAR---->

          <button @click="sendBeachIdToShow(index)">Ver</button>
          <button @click="sendBeachIdToReserve(index)">Reservar</button>
        </div>

        <div id="right">
          <!--FOTO DE LA PLAYA--->
          <img :src="setImage(beach.image)" />

          <!--GRÁFICO PARA DESTACAR VISUALMENTE LIBRE/OCUPADO, EN CASO DE QUE INDIQUE FECHA:--->
          <pie-chart
            :class="{hidden: !beach.free }"
            :data="[['Libre',beach.free],
        ['Ocupado',(beach.capacity-beach.free)]]"
          ></pie-chart>
        </div>

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
  background-color: #ebecf186;

  margin-bottom: 1rem;
  display: flex;
}
img {
  width: 300px;
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

div#left,
div#right {
  width: 50%;
}
.hidden {
  display: none;
}

canvas {
  width: 50px;
}
</style>