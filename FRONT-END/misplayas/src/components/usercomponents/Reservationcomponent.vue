<template>
  <div>
    <p>Id. de la reserva: {{reservation.id}}</p>
    <p>Fecha de la reserva: {{formatDateToUser(reservation.date)}}</p>
    <p>Fecha y hora reservada: {{formatDateToUser(reservation.visit)}}</p>
    <p>Reserva para: {{reservation.places}} personas</p>
    <p>Playa nº: {{reservation.id_beach}}, {{reservation.name}}</p>
    <p>Total euros: {{reservation.total_euros}}</p>
    <p>Valoración: {{reservation.value}}</p>
    <p>Valoración: {{reservation.comment}}</p>

    <button @click="vote =! vote">Votar</button>

    <section v-show="vote">
      <input type="text" placeholder="Valoración" v-model="newValue" />
      <br />
      <input class="textarea" type="textarea" placeholder="Comentario" v-model="newComment" />

      <button @click="voteReserv">Aceptar</button>

      <p>{{message}}</p>
      <p>{{errorMessage}}</p>
    </section>
  </div>
</template>


<script>
import { getAuthToken } from "../../api/utils";
import axios from "axios";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default {
  name: "Reservationcomponent",
  props: {
    reservation: Object,
  },
  data() {
    return {
      newValue: "",
      newComment: "",
      vote: false,
      errorMessage: "",
      message: "",
    };
  },

  methods: {
    async voteReserv() {
      let id = this.reservation.id;
      console.log(id);
      const token = getAuthToken();
      axios.defaults.headers.common["Authorization"] = `${token}`;
      let comment;
      if (this.newComment === "") {
        comment = "sin comentar";
      } else {
        comment = newComment;
      }

      try {
        const response = await axios.post(
          `http://localhost:3000/reservations/${id}/votes`,
          {
            value: this.newValue,
            comment: comment,
          }
        );
        this.message = response.data.message;
      } catch (error) {
        this.errorMessage = error.response.data.message;
      }
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