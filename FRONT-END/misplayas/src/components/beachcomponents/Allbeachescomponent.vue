<template>
  <div>
    <!--COMPONENTE PARA LISTAR PLAYAS EN LISTADO DE ADMINISTRACIÓN--->
    <input type="search" v-model="search" placeholder="Busca por nombre" />

    <div id="beach" v-for="(beach,index) in showedBeaches" :key="beach.id">
      <p class="name">{{beach.id}}. {{beach.name}}</p>
      <p class="name">Municipio: {{beach.municipality}}. Provincia: {{beach.province}}</p>
      <table>
        <tr>
          <td class="title">Descripción:</td>
          <td>{{beach.description}}</td>
        </tr>
        <tr>
          <td class="title">Tipo:</td>
          <td>{{beach.type}}</td>
        </tr>
        <tr>
          <td class="title">Capacidad:</td>
          <td>{{beach.capacity}} personas</td>
        </tr>
        <tr>
          <td class="title">Horario:</td>
          <td>de {{beach.start_time}} a {{beach.end_time}}</td>
        </tr>
        <tr>
          <td class="title">Mes inicio:</td>
          <td>
            desde
            <strong>{{nameMonth(beach.start_month)}}</strong> hasta
            <strong>{{nameMonth(beach.end_month)}}</strong>, ambos incluidos
          </td>
        </tr>
        <tr>
          <td class="title">Valoración media de usuarios usuarios:</td>
          <td>{{beach.voteAverage}}</td>
        </tr>
        <tr>
          <td class="title">Servicios:</td>
          <td>
            <p>Salvamento: {{setService(beach.lifesaving)}}, Parking: {{setService(beach.parking)}}, WC: {{setService(beach.toilet)}}, Hostelería: {{setService(beach.bar_restaurant)}}, Acceso minusv: {{setService(beach.disabled_access)}}</p>
          </td>
        </tr>
        <tr>
          <td class="title">Nº acumulado de reservas:</td>
          <td>{{beach.Nºreservas}}</td>
        </tr>

        <tr>
          <td class="title">Estado:</td>
          <td>
            {{getStatus(beach.active)}}
            <button @click="sendIdToggle(index)">Cambiar estado</button>
          </td>
        </tr>
      </table>

      <img :src="setImage(beach.image)" />
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
      elementsPerPage: 3,
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
      if (img === null) {
        {
          let generic = "yellow.jpg";
          return process.env.VUE_APP_STATIC + generic;
        }
      } else if (!img) {
        return this.spinner;
      } else {
        return process.env.VUE_APP_STATIC + img;
      }
    },
    //FUNCION PARA SABER ESTADO DE LA PLAYA
    getStatus(value) {
      if (value === 1) {
        return "Activa";
      } else {
        return "Inactiva";
      }
    },
    ///FUNCIÓN PARA ASIGNAR NOMBRE A LOS MESES EN LA INFO DE LA PLAYA
    nameMonth(number) {
      const monthNames = [
        "enero",
        "febrero",
        "marzo",
        "abril",
        "mayo",
        "junio",
        "julio",
        "agosto",
        "septiembre",
        "octubre",
        "noviembre",
        "diciembre",
      ];

      return monthNames[number - 1];
    },

    //FUNCIÓN QUE EMITE EVENTO PARA ID A LA VISTA

    sendIdToggle(index) {
      let beachId = this.showedBeaches[index].id;
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
  width: 80%;
}
p,
td,
li {
  font-size: 0.8rem;
  color: #353a64;
  text-align: left;
}
.name {
  font-size: 1rem;
  font-weight: 800;
  text-align: center;
}
td.title {
  font-weight: 800;
  width: 40%;
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
  text-align: center;
}
@media (min-width: 700px) {
  img {
    width: 80%;
  }
  p,
  td,
  li {
    font-size: 1.1rem;
    color: #353a64;
  }
  p.name {
    font-size: 1.5rem;
  }
  button.pages {
    height: 20px;
    width: 100px;
    margin: 0;
  }
  button {
    width: 200px;
    margin: 0 2rem;
  }
  table {
    width: 80%;
    margin: 1rem auto;
  }
}
</style>
