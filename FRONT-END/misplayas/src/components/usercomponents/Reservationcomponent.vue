<template>
  <div>
    <p id="number">Id. de la reserva: {{reservation.id}}</p>
    <p>Realizada el: {{formatDateToUser(reservation.date)}}</p>
    <p>Fecha y hora reservada: {{formatDateToUser(reservation.visit)}}</p>
    <table>
      <tr>
        <td class="title">Reserva para:</td>
        <td>{{reservation.places}} personas</td>
      </tr>
      <tr>
        <td class="title">Playa nº:</td>
        <td>{{reservation.id_beach}}, {{reservation.name}}</td>
      </tr>
      <tr>
        <td class="title">Total euros:</td>
        <td>{{reservation.total_euros}}</td>
      </tr>
      <tr>
        <td class="title">Valoración:</td>
        <td>{{reservation.value}}</td>
      </tr>
      <tr>
        <td class="title">Comentario:</td>
        <td>{{reservation.comment}}</td>
      </tr>
    </table>

    <!---Sólo aparece el botón de anular hasta 24 h antes de la reserva--->
    <button
      :class="{hidden: new Date(reservation.visit) <= addOneDay(new Date())}"
      @click="eraseInfo"
    >Anular reserva</button>

    <!---Sólo aparece el botón de votar una vez superada la fecha de reserva--->
    <section
      :class="{hidden: reservation.value !== 'pendiente de valorar'|| new Date() < new Date(reservation.visit)}"
    >
      <button @click="vote =!vote">Votar</button>
      <section v-show="vote">
        <input type="text" placeholder="Valoración 1 - 5" v-model="newValue" />
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
    //FUNCIÓN QUE ENVÍA LA INFORMACIÓN DE LA VOTACIÓN A LA LISTA
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
    //FUNCIÓN QUE ENVÍA LA INFORMACIÓN PARA BIRRAR
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
      let dateToUser = `${format(new Date(date), "EEEE, d'/'M'/'yyyy", {
        locale: es,
      })} a las ${format(new Date(date), "p")}`;
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
p,
td {
  font-size: 0.8rem;
}
p#number {
  text-decoration: underline;
  font-size: 0.9rem;
}
table {
  width: 60%;
  margin: auto;
}

td {
  text-align: left;
}
td.title {
  font-weight: 800;
}
button {
  margin-top: 1rem;
}
@media (min-width: 1000px) {
  p,
  td {
    font-size: 1.1rem;
  }
  p#number {
    font-size: 1.3rem;
  }
  td {
    height: 40px;
  }
}
</style>