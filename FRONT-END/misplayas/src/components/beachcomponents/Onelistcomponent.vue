<template>
  <div>
    <input type="search" v-model="search" placeholder="Busca por palabras" />
    <onebeachcomponent
      v-for="(beach,index) in filtered"
      :key="beach.id"
      :index="index"
      :beach="beach"
      :visit="visit"
      :places="places"
      :options="options"
    />
  </div>
</template>

<script>
import onebeachcomponent from "@/components/beachcomponents/Onebeachcomponent.vue";

export default {
  name: "onelistcomponent",
  components: {
    onebeachcomponent,
  },
  props: {
    beaches: Array,
    visit: String,
    places: String,
    options: Object,
    lifesaving: Boolean,
  },
  data() {
    return {
      beach: {},
      index: null,
      search: "",
    };
  },
  computed: {
    //BUSCADOR POR PALABRAS
    filtered() {
      if (!this.search) {
        //si search está vacío, devuelve beaches tal cual
        return this.beaches;
      }
      return this.beaches.filter(
        (item) =>
          item.name.toLowerCase().includes(this.search.toLowerCase()) ||
          item.municipality.toLowerCase().includes(this.search.toLowerCase()) ||
          item.province.toLowerCase().includes(this.search.toLowerCase()) ||
          item.description.toLowerCase().includes(this.search.toLowerCase())
      );
    },
  },
};
</script>