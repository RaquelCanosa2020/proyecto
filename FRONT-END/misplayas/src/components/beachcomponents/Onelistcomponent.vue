<template>
  <div id="listbeaches">
    <input type="search" v-model="search" placeholder="Busca rápida por palabras" />
    <onebeachcomponent
      v-for="(beach,index) in showedBeaches"
      :key="beach.id"
      :index="index"
      :beach="beach"
      :visit="visit"
      :places="places"
      :options="options"
    />
    <ul id="pagination">
      <li v-for="page in pages" :key="page">
        <button class="pages" :class="{active: currentPage === page}" @click="goTo(page)">{{page+1}}</button>
      </li>
    </ul>
    <p id="pages">Páginas {{currentPage+1}} de {{pages.length}}</p>
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
      currentIndex: 0,
      elementsPerPage: 4,
      currentPage: 0,
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
    //PAGINACIÓN
    showedBeaches() {
      return this.filtered.slice(
        this.currentIndex,
        this.currentIndex + this.elementsPerPage
      );
    },
    pages() {
      let numberOfPages = Math.ceil(
        this.filtered.length / this.elementsPerPage
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
  },
};
</script>
<style scoped>
div#listbeaches {
  margin-top: 1rem;
  width: 100%;
}

input {
  width: 150px;
  height: 20px;
  border-radius: 2em;
  margin-bottom: 1rem;
}
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
@media (min-width: 700px) {
  input {
    width: 300px;
    height: 40px;
    border-radius: 2em;
  }
}
</style>