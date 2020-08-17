<template>
  <div>
    <div>
      <section v-for="(userphoto, index) in userphotos" :key="userphoto.id">
        <p>Foto id.: {{userphoto.id}}</p>
        <p>{{userphoto.name}}</p>
        <img :src="setImage(userphoto.link)" />

        <p>{{formatDateToUser(userphoto.date)}}</p>
        <p>{{userphoto.description}}</p>

        <button @click="sendId(index)">Eliminar</button>
      </section>
    </div>
  </div>
</template>


<script>
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default {
  name: "Userphotocomponent",
  props: {
    userphotos: Array,
  },
  methods: {
    sendId(index) {
      let PhotoId = this.userphotos[index].id;
      console.log(PhotoId);
      this.$emit("send", PhotoId);
    },

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
    setImage(img) {
      return process.env.VUE_APP_STATIC + img;
    },
  },
};
</script>
<style scoped>
div {
  background-color: ivory;
  width: 75%;
  margin: auto;
}
</style>