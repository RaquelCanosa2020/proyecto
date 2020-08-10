<template>
  <div>
    <ul>
      <li>
        <input type="search" v-model="search" placeholder="Busca por nombre" />
      </li>
      <li v-for="beach in filtered" :key="beach.id">
        <beachcomponent :beach="beach" :visit="visit" :places="places" />
      </li>
    </ul>
  </div>
</template>

<script>
import beachcomponent from "@/components/prueba/Beachcomponent.vue";

export default {
  name: "Liscomponent",
  components: {
    beachcomponent,
  },
  props: {
    beaches: Array,
    visit: String,
    places: Number,
  },
  data() {
    return {
      beach: {},
      search: "",
    };
  },
  computed: {
    filtered() {
      if (!this.search) {
        //si search está vacío, devuelve beaches tal cual
        return this.beaches;
      }
      return this.beaches.filter((item) =>
        item.name.toLowerCase().includes(this.search.toLowerCase())
      );
    },
  },
};
</script>