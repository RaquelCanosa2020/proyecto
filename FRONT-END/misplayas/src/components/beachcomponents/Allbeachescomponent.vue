<template>
  <div>
    <input type="search" v-model="search" placeholder="Busca por nombre" />
    <!--pendiente orden---->
    <div id="beach" v-for="(beach,index) in filtered" :key="beach.id">
      <p>{{beach.id}}</p>
      <p>{{beach.name}}, {{beach.municipality}}</p>
      <p>{{beach.province}}</p>
      <p>{{beach.description}}</p>
      <p>Tipo: {{beach.type}} personas</p>
      <p>Capacidad: {{beach.capacity}} personas</p>
      <p>Valoración media de usuarios: {{beach.voteAverage}}</p>
      <p>Hora inicio: {{beach.start_time}}</p>
      <p>Hora fin: {{beach.end_time}}</p>
      <p>Mes inicio: {{beach.start_month}}</p>
      <p>Mes fin: {{beach.end_month}}</p>
      <p>Valoración media de usuarios usuarios: {{beach.voteAverage}}</p>
      <p>Servicios:</p>
      <p>Salvamento: {{beach.lifesaving}}, Parking: {{beach.parking}}, WC: {{beach.toilet}}, Hostelería: {{beach.bar_restaurant}}, Acceso minusv: {{beach.disabled_access}}</p>
      <p>Nº acumulado de reservas: {{beach.Nºreservas}}</p>

      <p>Estado: {{getStatus(beach.active)}}</p>

      <p>
        <img :src="setImage(beach.image)" />
      </p>

      <!--- <button @click="sendIdEdit(index)">Editar</button>--->
      <button @click="sendIdToggle(index)">Cambiar estado</button>
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
    //FUNCIÓN PARA VER LAS IMÁGENES EN LA PLAYA (en el listado se aplica al componente)
    setImage(img) {
      return process.env.VUE_APP_STATIC + img;
    },
    //FUNCION PARA SABER ESTADO DE LA PLAYA
    getStatus(value) {
      if (value === 1) {
        return "Activa";
      } else {
        return "Inactiva";
      }
    },

    //FUNCIÓN QUE EMITE EVENTO PARA ID A LA VISTA
    /*sendIdEdit(index) {
      let beachId = this.beaches[index].id;
      //console.log(beachId);
      this.$emit("sendEdit", beachId);
    },*/
    sendIdToggle(index) {
      let beachId = this.beaches[index].id;
      //console.log(beachId);
      this.$emit("sendToggle", beachId);
    },
  },
};
</script>
<style scoped>
div#beach {
  background-color: #ebecf1;
  width: 60%;
  margin: auto;
}
img {
  width: 500px;
}
</style>
