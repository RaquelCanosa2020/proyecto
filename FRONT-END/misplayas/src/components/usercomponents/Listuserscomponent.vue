<template>
  <div>
    <input type="search" v-model="search" placeholder="Busca por nombre" />

    <div id="user" v-for="(user,index) in showedUsers" :key="user.id">
      <p>Id: {{user.id}}, {{user.name}}</p>

      <p>Rol: {{user.role}}. Activo: {{setActive(user.active)}}</p>
      <p>Email:{{user.email}}</p>

      <p>Fecha de alta: {{formatDateToUser(user.registration_date)}}</p>
      <p>Nº de reservas: {{user.Nºreservas}}</p>
      <p>Nº de plazas reservadas: {{user.Nºplazas}} personas</p>
      <p
        :class="{hidden: user.Nºreservas === 0}"
      >Última reserva: {{formatDateToUser(user.ultima_reserva)}}</p>

      <img :src="setImage(user.image)" />

      <button @click="sendIdEdit(index)">Editar</button>
      <button @click="sendIdErase(index)">Borrar</button>
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
import { format } from "date-fns";
import { es } from "date-fns/locale";
export default {
  name: "Listuserscomponent",
  props: {
    users: Array,
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
        return this.users;
      }
      return this.users.filter((item) =>
        item.name.toLowerCase().includes(this.search.toLowerCase())
      );
    },
    showedUsers() {
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
    //CAMBIAR 1/O EN ACTIVE

    setActive(el) {
      if (el === 1) {
        return "Sí";
      } else {
        return "No";
      }
    },
    //FUNCIÓN PARA VER LAS IMÁGENES EN LA PLAYA (en el listado se aplica al componente)
    setImage(img) {
      if (img === null) {
        let avatar = "Avatar.jpg";
        return process.env.VUE_APP_STATIC + avatar;
      } else {
        return process.env.VUE_APP_STATIC + img;
      }
    },

    //FUNCIÓN QUE EMITE EVENTO PARA ID A LA VISTA
    sendIdEdit(index) {
      let userData = this.users[index];

      this.$emit("sendEdit", userData);
    },
    sendIdErase(index) {
      let userId = this.users[index].id;

      this.$emit("sendErase", userId);
    },

    //FUNCION PARA FORMATEAR FECHA
    formatDateToUser(date) {
      let dateToUser = `${format(
        new Date(date),
        "EEEE, d 'de' MMMM 'de' yyyy",
        {
          locale: es,
        }
      )} a las ${format(new Date(date), "p")} horas`;
      return dateToUser;
    },
  },
};
</script>
<style scoped>
div#user {
  background-color: #ebecf1;
  width: 60%;
  margin: auto;
}

img {
  width: 150px;
  border-radius: 50%;
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

.hidden {
  display: none;
}
</style>