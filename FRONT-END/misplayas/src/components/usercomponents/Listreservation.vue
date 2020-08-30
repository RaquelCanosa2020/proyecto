<template>
  <div>
    <section>
      <reservationcomponent
        v-for="(reservation,index) in reservations"
        :key="reservation.id"
        :index="index"
        :reservation="reservation"
        @sendIdVote="voteReserv"
        @sendIdErase="eraseRes"
      />
    </section>
  </div>
</template>
<script>
import reservationcomponent from "@/components/usercomponents/Reservationcomponent.vue";
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
  name: "Listreservation",
  components: {
    reservationcomponent,
  },
  props: {
    reservations: Array,
  },
  data() {
    return {
      reservation: {},
    };
  },
  methods: {
    async voteReserv(voteInfo) {
      const token = getAuthToken();
      axios.defaults.headers.common["Authorization"] = `${token}`;

      try {
        console.log("antes");
        let comment;
        if (voteInfo.comment === "") {
          comment = "sin comentar";
        } else {
          comment = voteInfo.comment;
        }
        const response = await axios.post(
          `http://localhost:3000/reservations/${voteInfo.id}/votes`,
          {
            value: voteInfo.value,
            comment: comment,
          }
        );
        console.log("después");

        sweetAlertOk(response.data.message);
        this.reservations[voteInfo.index].value = voteInfo.value;
        this.reservations[voteInfo.index].comment = comment;
      } catch (error) {
        //this.errorMessage = error.response.data.message
        sweetAlertNotice(error.response.data.message);
      }
    },

    /*async eraseReserv(eraseInfo) {
      const id = eraseInfo.id;
      const token = getAuthToken();
      axios.defaults.headers.common["Authorization"] = `${token}`;
      //sweetAlertErase;
      try {
        const response = await axios.delete(
          `http://localhost:3000/reservations/${id}`
        );

        sweetAlertOk(response.data.message);
        this.reservations[eraseInfo.index] = "";
      } catch (error) {
        sweetAlertNotice(error.response.data.message);
      }
    },*/

    eraseRes(eraseInfo) {
      this.$emit("sendIdEr", eraseInfo);
    },
  },
};
</script>