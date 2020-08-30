<template>
  <div>
    <div>
      <section v-for="photo in photos" :key="photo.id">
        <p>Id. {{photo.id}}</p>
        <img :src="setImage(photo.link)" />
        <p>{{photo.description}}</p>
        <p>{{formatDateToUser(photo.date)}}. Usuario: {{photo.name}}</p>
      </section>
    </div>
  </div>
</template>


<script>
import { format } from "date-fns";
import { es } from "date-fns/locale";
export default {
  name: "Photoscomponent.vue",
  props: {
    photos: Array,
  },
  methods: {
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
  display: flex;
  flex-wrap: wrap;
}
section {
  text-align: center;
  background-color: #ebecf1;
}
img {
  width: 500px;
  border-radius: 2em;
}
</style>