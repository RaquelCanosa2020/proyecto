<template>
  <div>
    <p id="global">{{global}}</p>
    <section v-for="vote in votes" :key="vote.index">
      <p>Fecha: {{formatDateToUser(vote.date)}}</p>
      <p>Valoración:{{vote.value}}</p>
      <p>Comentario: {{vote.comment}}</p>
      <p>Usuario: {{vote.name}}</p>
    </section>
  </div>
</template>


<script>
import { format } from "date-fns";
import { es } from "date-fns/locale";
export default {
  name: "Ratingscomponent.vue",
  props: {
    votes: Array,

    global: String,
  },
  methods: {
    formatDateToUser(date) {
      let dateToUser = `${format(
        new Date(date),
        "EEEE, d 'de' MMMM 'de' yyyy",
        {
          locale: es,
        }
      )} `;
      return dateToUser;
    },
  },
};
</script>

<style scoped>
p#global {
  font-size: 1.5rem;
  font-weight: 800;
  text-align: center;
  background-color: #353a64;
  padding: 2rem;
  border-radius: 1em;
  color: white;
}

div {
  width: 75%;
  text-align: left;
  margin: auto;
}
section {
  margin-bottom: 3rem;
  border-style: solid;
  border-width: 0.1rem;
  border-color: #59405c;
  padding: 1rem;
  background-color: #ebecf1;
  border-radius: 1em;
}
</style>