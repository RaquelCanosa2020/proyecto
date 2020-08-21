<template>
  <div>
    <searchbeachescomponent :beach="beach" />
  </div>
</template>
<script>
import searchbeachescomponent from "@/components/beachcomponents/Searchbeachescomponent.vue";
export default {
  name: "Onebeachview",
  components: {
    searchbeachescomponent,
  },
  data() {
    return {
      beach: {},
      date: "",
      hour: "",
    };
  },
  methods: {
    getVisit(date, hour) {
      let datehour = "";

      if (date === "" || hour === "") {
        datehour = "";
      } else {
        datehour = date + "T" + hour + ":" + "00";
      }
      console.log(datehour);
      return datehour;
    },

    async showData() {
      let visit = this.getVisit(this.date, this.hour);
      const id = this.$route.params.id;

      try {
        const response = await axios.post(
          `http://localhost:3000/beaches/${id}/show`,
          {
            visit: visit,
          }
        );
        this.beach = response.data.data;
      } catch (error) {
        console.log(error.response.data.message);
      }
    },
  },
  created() {
    this.showData;
  },
};
</script>