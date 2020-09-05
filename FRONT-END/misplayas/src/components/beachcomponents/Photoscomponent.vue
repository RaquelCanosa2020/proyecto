<template>
  <div>
    <div>
      <section v-for="photo in photos" :key="photo.id">
        <p>Foto nº: {{photo.id}}</p>
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
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
section {
  width: 70%;
  text-align: center;
  background-color: #ebecf1;
}
img {
  max-width: 90%;
  border-radius: 2em;
  margin: 1rem;
}
p {
  font-size: 0.6rem;
  padding: 0 1rem;
}

@media (min-width: 700px) {
  img {
    max-width: 250px;
  }
  p {
    font-size: 1rem;
  }
  @media (min-width: 1000px) {
    img {
      max-width: 450px;
    }
    p {
      font-size: 1.2rem;
    }
  }
}
</style>