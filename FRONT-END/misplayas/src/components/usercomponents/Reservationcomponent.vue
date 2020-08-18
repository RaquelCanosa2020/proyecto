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

    <button @click="voteOption">Votar</button>
    <button @click="eraseReserv">Anular reserva</button>

    <section v-show="vote">
      <input type="text" placeholder="Valoración" v-model="newValue" />
      <br />
      <input class="textarea" type="textarea" placeholder="Comentario" v-model="newComment" />

      <button @click="voteReserv">Aceptar</button>
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
    };
  },

  methods: {
    voteOption() {
      if (this.reservation.value === "pendiente de valorar") {
        this.vote = true;
      } else {
        this.vote = false;
        sweetAlertNotice("ya has votado esta reserva");
      }
    },

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
        sweetAlertOk(response.data.message);
      } catch (error) {
        //this.errorMessage = error.response.data.message
        sweetAlertNotice(error.response.data.message);
        this.vote = false;
      }
    },

    async eraseReserv() {
      let id = this.reservation.id;
      console.log(id);
      const token = getAuthToken();
      axios.defaults.headers.common["Authorization"] = `${token}`;
      sweetAlertErase;
      try {
        const response = await axios.delete(
          `http://localhost:3000/reservations/${id}`
        );

        sweetAlertOk(response.data.message);
        setTimeout(() => {
          location.reload();
        }, 2000);
      } catch (error) {
        sweetAlertNotice(error.response.data.message);
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
<style scoped>
div {
  background-color: #ebecf186;
  width: 75%;
  margin: auto;
}
</style>