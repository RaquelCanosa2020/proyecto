<template>
  <!--COMPONENTE DE INFO DE CADA PLAYA INDIVIDYAL PARA EL BUSCADOR-->
  <div class="onebeach">
    <h1>{{beach.name}}</h1>
    <!--INFORMACIÓN GRÁFICA--->
    <div id="graphics">
      <!--FOTO--->
      <img :src="setImage(beach.image)" :class="{wide: !beach.free}" />

      <!--GRÁFICO PARA DESTACAR VISUALMENTE LIBRE/OCUPADO, EN CASO DE QUE INDIQUE FECHA:--->
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

    <section id="info">
      <p>Municipio: {{beach.municipality}} ({{beach.province}})</p>

      <p>Capacidad: {{beach.capacity}} personas</p>
      <!----En caso de que se indique fecha, muestra la disponibilidad------>
      <p :class="{hidden: !beach.free}">
        Plazas libres:
        <button id="free">{{beach.free}}</button>
      </p>
    </section>
  </div>
</template>


  <script>
export default {
  name: "Onebeachcomponent",
  props: {
    beach: Object,
  },

  methods: {
    //FUNCIÓN PARA SACAR LA DIRECCIÓN DE LA IMAGEN ACTUAL
    setImage(img) {
      if (img === null) {
        {
          let generic = "yellow.jpg";
          return process.env.VUE_APP_STATIC + generic;
        }
      } else if (!img) {
        return this.spinner;
      } else {
        return process.env.VUE_APP_STATIC + img;
      }
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