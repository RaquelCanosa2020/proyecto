<template>
  <div>
    <div>
      <p>{{global}}</p>
      <section v-for="vote in votes" :key="vote.index">
        <p>Fecha: {{formatDateToUser(vote.date)}}</p>
        <p>Valoración:{{vote.value}}</p>
        <p>Comentario: {{vote.comment}}</p>
        <p>Usuario: {{vote.name}}</p>
      </section>
    </div>
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
section {
  background-color: #ebecf1;
  margin-bottom: 1rem;
}
</style>