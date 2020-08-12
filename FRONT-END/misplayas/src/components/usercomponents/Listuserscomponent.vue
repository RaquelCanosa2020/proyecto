<template>
  <div>
    <input type="search" v-model="search" placeholder="Busca por nombre" />

    <div v-for="(user,index) in filtered" :key="user.id">
      <p>{{user.id}}</p>
      <p>{{user.name}}</p>
      <p>Rol: {{user.role}}</p>
      <p>{{user.email}}</p>
      <p>Fecha de alta: {{user.registration_date}}</p>
      <p>Nº de reservas: {{user.Nºreservas}} personas</p>
      <p>Nº de plazas reservadas: {{user.Nºplazas}}</p>
      <p>Última reserva: {{user.ultima_reserva}}</p>

      <img :scr="setImage(user.image)" />

      <button @click="sendIdEdit(index)">Editar</button>
      <button @click="sendIdErase(index)">Borrar</button>
    </div>
  </div>
</template>


<script>
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
        //si search está vacío, devuelve useres tal cual
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
      return process.env.VUE_APP_STATIC + img;
    },
    //FUNCION PARA FORMATEAR FECHA
    formatDate(date) {
      let formatDate = `${format(new Date(date), "d '/' M '/' Y", {
        locale: es,
      })} {format(new Date(date), "p")} horas`;
      return dateToUser;
    },
  },

  //FUNCIÓN QUE EMITE EVENTO PARA ID A LA VISTA
  sendIdEdit(index) {
    let userId = this.useres[index].id;
    //console.log(userId);
    this.$emit("sendEdit", userId);
  },
  sendIdErase(index) {
    let userId = this.users[index].id;
    //console.log(userId);
    this.$emit("sendErase", userId);
  },
};
</script>