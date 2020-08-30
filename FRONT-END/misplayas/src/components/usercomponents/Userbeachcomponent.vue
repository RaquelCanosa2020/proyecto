<template>
  <div>
    <div>
      <section v-for="userbeach in userbeaches" :key="userbeach.id">
        <h1>Playa id.: {{userbeach.id}}, {{userbeach.name}}, {{userbeach.municipality}}, {{userbeach.province}}</h1>
        <p>Nº Visitas: {{userbeach.numberOfReservations}} veces</p>
        <p>Tu última visita: {{formatDateToUser(userbeach.lastVisit)}}</p>
        <p>
          Tu valoración media de esta playa:
          <button id="rating">{{userbeach.yourAverageRating}}</button>
        </p>

        <router-link :to="{name:'Reserva', params: {id:userbeach.id}}">Reservar >></router-link>
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
section {
  background-color: #ebecf186;
  width: 75%;
  margin: auto;
  margin-bottom: 3rem;
  border-style: solid;
  border-width: 0.1rem;
  width: 75%;
  margin: 2rem auto;
  border-color: #59405c;
  padding: 1rem;

  border-radius: 1em;
}
button#rating {
  background-color: #4cbbb9;
  border: none;
  border-radius: 20%;
  color: #353a64;
  font-size: 1rem;
  font-weight: bold;
}
</style>