<template>
  <div>
    <div>
      <section v-for="userbeach in userbeaches" :key="userbeach.id">
        <p>Playa id.: {{userbeach.id}}, {{userbeach.name}}, {{userbeach.municipality}}, {{userbeach.province}}</p>
        <p>Has ido: {{userbeach.numberOfReservations}} veces</p>
        <p>Tu última visita: {{formatDateToUser(userbeach.lastVisit)}}</p>
        <p>Tu valoración media de esta playa: {{userbeach.yourAverageRating}}</p>
      </section>
    </div>
  </div>
</template>


<script>
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default {
  name: "Userbeachcomponent",
  props: {
    userbeaches: Array,
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