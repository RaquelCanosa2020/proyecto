<template>
  <div>
    <div>
      <section v-for="(beach,index) in beaches" :key="beach.id">
        <p>{{beach.name}}, {{beach.municipality}}</p>
        <p>{{beach.province}}</p>
        <p>Descripción: {{beach.description}}</p>
        <p>Capacidad: {{beach.capacity}} personas</p>

        <button @click="sendBeachId(index)">Ver</button>
      </section>
    </div>
  </div>
</template>


<script>
export default {
  name: "Searchbeachescomponent",
  props: {
    beaches: Array,
    visit: String,
    places: Number,
  },
  methods: {
    sendBeachId(index) {
      let beachId = this.beaches[index].id;
      //console.log(beachId);
      this.$emit("sendId", beachId);
    },
  },
};
</script>