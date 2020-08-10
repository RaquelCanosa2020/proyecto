<template>
  <div>
    <section v-for="reservation in reservations" :key="reservation.id">
      <reservationcomponent :reservation="reservation" />
    </section>
  </div>
</template>
<script>
import reservationcomponent from "@/components/usercomponents/Reservationcomponent.vue";

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
};
</script>