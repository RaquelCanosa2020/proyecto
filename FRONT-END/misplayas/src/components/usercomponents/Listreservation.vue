<template>
  <div>
    <section>
      <reservationcomponent
        v-for="(reservation,index) in showedReservations"
        :key="reservation.id"
        :index="index"
        :reservation="reservation"
        @sendIdVote="voteReserv"
        @sendIdErase="eraseRes"
      />
    </section>
    <ul id="pagination">
      <li v-for="page in pages" :key="page">
        <button class="pages" :class="{active: currentPage === page}" @click="goTo(page)">{{page+1}}</button>
      </li>
    </ul>
    <p id="pages">Páginas {{currentPage+1}} de {{pages.length}}</p>
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
      currentIndex: 0,
      elementsPerPage: 4,
      currentPage: 0,
    };
  },
  computed: {
    showedReservations() {
      return this.reservations.slice(
        this.currentIndex,
        this.currentIndex + this.elementsPerPage
      );
    },
    pages() {
      let numberOfPages = Math.ceil(
        this.reservations.length / this.elementsPerPage
      );
      let pageArray = [];
      for (let i = 0; i < numberOfPages; i++) {
        pageArray.push(i);
      }
      return pageArray;
    },
  },
  methods: {
    goTo(page) {
      this.currentPage = page;
      this.currentIndex = page * this.elementsPerPage;
    },
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
<style scoped>
ul {
  display: flex;
}
.active {
  background-color: #4cbbb9;
}
ul#pagination {
  display: flex;
  justify-content: center;
  list-style: none;
}

button.pages {
  background-color: white;
  height: 20px;
  border-radius: 0;
  border-color: #353a64;
  border-style: solid;
}
</style>