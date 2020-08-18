<template>
  <div>
    <input type="search" v-model="search" placeholder="Busca por nombre" />

    <div id="user" v-for="(user,index) in users" :key="user.id">
      <p>{{user.id}}</p>
      <p>{{user.name}}</p>
      <p>Rol: {{user.role}}</p>
      <p>{{user.email}}</p>
      <p>Activo: {{user.active}}</p>
      <p>Fecha de alta: {{formatDateToUser(user.registration_date)}}</p>
      <p>Nº de reservas: {{user.Nºreservas}}</p>
      <p>Nº de plazas reservadas: {{user.Nºplazas}} personas</p>
      <p>Última reserva: {{formatDateToUser(user.ultima_reserva)}}</p>

      <img :src="setImage(user.image)" />

      <button @click="sendIdEdit(index)">Editar</button>
      <button @click="sendIdErase(index)">Borrar</button>
    </div>
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
  },
  methods: {
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
</style>