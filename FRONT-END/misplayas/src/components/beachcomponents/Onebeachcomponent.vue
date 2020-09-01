<template>
  <div>
    <div class="main">
      <!--FOTO DE LA PLAYA--->

      <img :class="{hidden: beach.free }" :src="setImage(beach.image)" />

      <!----En caso de que se indique fecha, muestra la disponibilidad------>

      <section id="info">
        <h1>{{beach.name}}</h1>
        <p>Municipio: {{beach.municipality}} ({{beach.province}})</p>

        <p>Capacidad: {{beach.capacity}} personas</p>
        <p :class="{hidden: !beach.free}">
          Plazas libres:
          <button id="free">{{beach.free}}</button>
        </p>
      </section>
      <!--GRÁFICO PARA DESTACAR VISUALMENTE LIBRE/OCUPADO, EN CASO DE QUE INDIQUE FECHA:--->

      <!--BOTONES CON EVENTOS PARA LA VISTA, ENVÍAN EL ID DE LA PLAYA A VER O RESERVAR---->

      <section id="chart">
        <div
          class="chart-container"
          :class="{hidden: !beach.free }"
          style="position: relative; width:200px;margin-right:40px"
        >
          <pie-chart
            :class="{hidden: !beach.free }"
            :data="[['Libre',beach.free],
        ['Ocupado',(beach.capacity-beach.free)]]"
          ></pie-chart>
        </div>
      </section>

      <section id="button">
        <p>
          <button id="rating">{{beach.voteAverage}}</button>
        </p>
        <p class="link">
          <router-link tag="button" :to="{name:'Playa', params: {id:beach.id}}">+ info</router-link>
        </p>
        <!---<button @click="send">Reservar</button>----->
        <p class="link">
          <router-link
            tag="button"
            :to="{name:'Reserva', params: {id:beach.id, name: beach.name,
      municipality: beach.municipality, province: beach.province}}"
          >Reservar</router-link>
        </p>
      </section>
    </div>
  </div>
</template>


  <script>
export default {
  name: "Onebeachcomponent",
  props: {
    beach: Object,
    visit: String,
    places: String,
    options: Object,
    lifesaving: Boolean,
  },

  methods: {
    //FUNCIÓN PARA SACAR LA DIRECCIÓN DE LA IMAGEN ACTUAL
    setImage(img) {
      return process.env.VUE_APP_STATIC + img;
    },
  },
};
</script>
<style scoped>
button {
  border: solid #353a64 0.5px;
  color: #353a64;
}
div {
  margin-bottom: 1rem;
  padding: 1rem;
  border-radius: 2em;
  color: whitesmoke;
  max-width: 100%;
  margin-right: auto;
  margin-left: auto;
}
div.main {
  display: flex;
  justify-content: space-around;
  background-color: #353a64;
  max-width: 100%;
}

img {
  width: 30%;
  border-radius: 2em;
}
router-link {
  text-decoration: none;
  background-color: #353a64;
}

button#rating {
  width: 50%;
  height: 100%;
  background-color: #4cbbb9;
  border: none;
  border-radius: 20%;
  color: #353a64;
  font-size: 0.8rem;
  font-weight: bold;
}

section#button {
  display: flex;
  flex-direction: column;
  position: relative;
}

section#info {
  width: 50%;
  margin: 0 1rem;
}

.hidden {
  display: none;
}
button#free {
  font-size: 1.5rem;
  background-color: whitesmoke;
}

h1 {
  font-size: 1.3rem;
  display: inline-block;
}
p {
  font-size: 1rem;
  color: #ebecf1;
}

@media (min-width: 700px) {
  button#free {
    font-size: 1.8rem;
  }

  h1 {
    font-size: 1.5rem;
  }
  p {
    font-size: 1rem;
  }
  button#rating {
    font-size: 1.2rem;
  }
}
@media (min-width: 1000px) {
  button#free {
    font-size: 2rem;
  }

  h1 {
    font-size: 1.8rem;
    display: inline-block;
  }
  p {
    font-size: 1.2rem;
  }
  button#rating {
    font-size: 1rem;
  }
}
</style>