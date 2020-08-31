<template>
  <div>
    <input type="search" v-model="search" placeholder="Busca por nombre" />
    <!--pendiente orden---->
    <div id="beach" v-for="(beach,index) in showedBeaches" :key="beach.id">
      <p class="name">{{beach.id}}. {{beach.name}}</p>
      <p>Municipio: {{beach.municipality}}. Provincia: {{beach.province}}</p>
      <p>Descripción: {{beach.description}}</p>
      <p>Tipo: {{beach.type}} personas</p>
      <p>Capacidad: {{beach.capacity}} personas</p>
      <p>Valoración media de usuarios: {{beach.voteAverage}}</p>
      <p>Horario: de {{beach.start_time}} a {{beach.end_time}}</p>
      <p>Mes inicio: desde {{beach.start_month}} hasta {{beach.end_month}}</p>
      <p>Valoración media de usuarios usuarios: {{beach.voteAverage}}</p>
      <p>Servicios:</p>
      <p>Salvamento: {{setService(beach.lifesaving)}}, Parking: {{setService(beach.parking)}}, WC: {{setService(beach.toilet)}}, Hostelería: {{setService(beach.bar_restaurant)}}, Acceso minusv: {{setService(beach.disabled_access)}}</p>
      <p>Nº acumulado de reservas: {{beach.Nºreservas}}</p>

      <p>Estado: {{getStatus(beach.active)}}</p>

      <p>
        <img :src="setImage(beach.image)" />
      </p>

      <!--- <button @click="sendIdEdit(index)">Editar</button>--->
      <button @click="sendIdToggle(index)">Cambiar estado</button>
    </div>
    <ul id="pagination">
      <li v-for="page in pages" :key="page">
        <button class="pages" :class="{active: currentPage === page}" @click="goTo(page)">{{page+1}}</button>
      </li>
    </ul>
    <p id="pages">Páginas {{currentPage+1}} de {{pages.length}}</p>
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
      currentIndex: 0,
      elementsPerPage: 4,
      currentPage: 0,
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
    showedBeaches() {
      return this.filtered.slice(
        this.currentIndex,
        this.currentIndex + this.elementsPerPage
      );
    },
    pages() {
      let numberOfPages = Math.ceil(
        this.filtered.length / this.elementsPerPage
      );
      let pageArray = [];
      for (let i = 0; i < numberOfPages; i++) {
        pageArray.push(i);
      }
      return pageArray;
    },
  },
  methods: {
    goTo(page) {
      this.currentPage = page;
      this.currentIndex = page * this.elementsPerPage;
    },
    //CAMBIAR 1/O EN SERVICES

    setService(el) {
      if (el === 1) {
        return "Sí";
      } else {
        return "No";
      }
    },
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
  margin: 1rem auto;
  padding: 2rem;
}
img {
  width: 500px;
}

p.name {
  font-size: 1.5rem;
}
ul {
  display: flex;
  justify-content: center;
  list-style: none;
}

button.pages {
  background-color: white;
  height: 20px;
  border-radius: 0;
  border-color: #353a64;
  border-style: solid;
}

button.pages.active {
  background-color: #4cbbb9;
}

p#pages {
  color: white;
}
</style>
