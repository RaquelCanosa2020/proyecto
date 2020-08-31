<template>
  <div>
    <p>Id. de la reserva: {{reservation.id}}</p>
    <p>Fecha de la reserva: {{formatDateToUser(reservation.date)}}</p>
    <p>Fecha y hora reservada: {{formatDateToUser(reservation.visit)}}</p>
    <p>Reserva para: {{reservation.places}} personas</p>
    <p>Playa nº: {{reservation.id_beach}}, {{reservation.name}}</p>
    <p>Total euros: {{reservation.total_euros}}</p>
    <p>Valoración: {{reservation.value}}</p>
    <p>Comentario: {{reservation.comment}}</p>

    <button
      :class="{hidden: new Date(reservation.visit) <= addOneDay(new Date())}"
      @click="eraseInfo"
    >Anular reserva</button>

    <section
      :class="{hidden: reservation.value !== 'pendiente de valorar'|| new Date() < new Date(reservation.visit)}"
    >
      <button @click="vote =!vote">Votar</button>
      <section v-show="vote">
        <input type="text" placeholder="Valoración" v-model="newValue" />
        <br />
        <input class="textarea" type="textarea" placeholder="Comentario" v-model="newComment" />

        <button @click="voteReserv">Aceptar</button>
      </section>
    </section>
  </div>
</template>


<script>
import {
  getAuthToken,
  sweetAlertNotice,
  sweetAlertErase,
  sweetAlertOk,
} from "../../api/utils";
import axios from "axios";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { addDays } from "date-fns";

export default {
  name: "Reservationcomponent",
  props: {
    reservation: Object,
    index: Number,
  },
  data() {
    return {
      newValue: "",
      newComment: "",
      vote: false,
    };
  },

  methods: {
    voteReserv() {
      let voteInfo = {
        id: this.reservation.id,
        value: this.newValue,
        comment: this.newComment,
        index: this.index,
      };
      this.$emit("sendIdVote", voteInfo);

      this.vote = false;
    },

    eraseInfo() {
      let eraseInfo = {
        id: this.reservation.id,
        index: this.index,
      };

      this.$emit("sendIdErase", eraseInfo);
    },

    addOneDay(date) {
      return addDays(date, 1);
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
  },
};
</script>
<style scoped>
.hidden {
  display: none;
}
div {
  margin-bottom: 3rem;
  border-style: solid;
  border-width: 0.1rem;
  width: 75%;
  margin: 2rem auto;
  border-color: #59405c;
  padding: 1rem;
  background-color: #ebecf1;
  border-radius: 1em;
}
</style>