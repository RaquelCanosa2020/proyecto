<template>
  <div class="onebeach">
    <h1>{{beach.name}}</h1>
    <!--FOTO DE LA PLAYA--->
    <div id="graphics">
      <img :src="setImage(beach.image)" :class="{wide: !beach.free}" />
      <div
        class="chart"
        :class="{hidden: !beach.free }"
        style="position: relative; width:200px; margin: 10px;"
      >
        <pie-chart
          :legend="true"
          :class="{hidden: !beach.free }"
          :data="[['Libre',beach.free],
        ['Ocupado',(beach.capacity-beach.free)]]"
        ></pie-chart>
      </div>
      <section id="button">
        <p>
          <button id="rating">{{beach.voteAverage}}</button>
        </p>
        <p class="link">
          <button class="link">
            <router-link :to="{name:'Playa', params: {id:beach.id}}">+ info</router-link>
          </button>
        </p>
        <!---<button @click="send">Reservar</button>----->
        <p class="link">
          <button class="link">
            <router-link
              :to="{name:'Reserva', params: {id:beach.id, name: beach.name,
      municipality: beach.municipality, province: beach.province}}"
            >Reservar</router-link>
          </button>
        </p>
      </section>
    </div>

    <!----En caso de que se indique fecha, muestra la disponibilidad------>

    <section id="info">
      <p>Municipio: {{beach.municipality}} ({{beach.province}})</p>

      <p>Capacidad: {{beach.capacity}} personas</p>
      <p :class="{hidden: !beach.free}">
        Plazas libres:
        <button id="free">{{beach.free}}</button>
      </p>
    </section>
    <!--GRÁFICO PARA DESTACAR VISUALMENTE LIBRE/OCUPADO, EN CASO DE QUE INDIQUE FECHA:--->

    <!--BOTONES CON EVENTOS PARA LA VISTA, ENVÍAN EL ID DE LA PLAYA A VER O RESERVAR---->
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
div.onebeach {
  background-color: #353a64;
  border-radius: 2em;
}
section#info {
  text-align: left;
  margin-left: 10rem;
}
img {
  width: 150px;
  border-radius: 1em;
}

h1 {
  font-size: 1.2rem;
  color: white;
  padding-top: 1rem;
}
p {
  font-size: 0.7rem;
  color: white;
}
div#graphics {
  display: flex;
  justify-content: space-evenly;
}
button#rating {
  background-color: rgb(0, 217, 255);
  font-size: 1rem;
  font-weight: 700;
}
button.link,
button#free {
  width: 60px;
  font-size: 0.8rem;
  color: #353a64;
}
div.chart {
  display: none;
}
.hidden {
  display: none;
}
section#info {
  padding-bottom: 1rem;
}

@media (min-width: 700px) {
  div.onebeach {
    width: 80%;
    margin: auto;
  }
  img {
    width: 250px;
  }

  div#graphics {
    display: flex;
    justify-content: space-evenly;
  }
  .hidden {
    display: none;
  }

  h1 {
    font-size: 1.5rem;
  }
  p {
    font-size: 1rem;
  }
  button#rating {
    font-size: 1.5rem;
    font-weight: 700;
  }
  button.link,
  button#free {
    width: 80px;
    font-size: 1rem;
  }
  @media (min-width: 1000px) {
    div.chart {
      display: inline;
    }
    div.chart.hidden {
      display: none;
    }
    img {
      width: 400px;
    }

    .wide {
      width: 600px;
    }
    h1 {
      font-size: 2rem;
    }
    p {
      font-size: 1.3rem;
    }
    button#rating {
      font-size: 2rem;
    }
    button.link,
    button#free {
      width: 100px;
      height: 40px;
      font-size: 1.2rem;
    }
    @media (min-width: 1500px) {
      h1 {
        font-size: 2.5rem;
      }
      p {
        font-size: 1.5rem;
      }
      button#rating {
        font-size: 2rem;
      }
      button.link,
      button#free {
        width: 120px;
        height: 50px;
        font-size: 1.5rem;
      }
    }
  }
}
</style>