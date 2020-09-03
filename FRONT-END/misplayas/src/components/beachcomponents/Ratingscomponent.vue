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
  font-size: 0.7rem;
  font-weight: 800;
  text-align: center;
  background-color: #353a64;
  padding: 0.5rem;
  border-radius: 1em;
  color: white;
}

div {
  width: 85%;
  text-align: left;
  margin: auto;
}
section {
  margin-bottom: 1rem;
  border-style: solid;
  border-width: 0.1rem;
  border-color: #59405c;
  padding: 0.5rem;
  background-color: #ebecf1;
  border-radius: 1em;
}
p {
  font-size: 0.6rem;
  margin-top: 0.5px 0.2px;
}

@media (min-width: 700px) {
  p,
  p#global {
    font-size: 1rem;
  }
}
@media (min-width: 1000px) {
  p,
  p#global {
    font-size: 1.2rem;
  }
}
</style>