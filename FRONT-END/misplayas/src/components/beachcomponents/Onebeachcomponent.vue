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
          :colors="['#353a64','#ce4841']"
          :class="{hidden: !beach.free }"
          :data="[['Libre',beach.free],
        ['Ocupado',(beach.capacity-beach.free)]]"
        ></pie-chart>
      </div>
      <section id="button">
        <p>Valoración usuarios:</p>
        <ul>
          <li>{{beach.voteAverage}}</li>
          <li
            class="sun"
            :class="{sun3: number<beach.voteAverage, 
          sun2: number>beach.voteAverage&&number<=beach.voteAverage+0.5,
          sun1: number>beach.voteAverage&&number>beach.voteAverage+0.5}"
            v-for="number in [1,2,3,4,5]"
            :key="number.id"
          >{{number}}</li>
        </ul>

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
      <p>Municipio: {{beach.municipality}} ({{beach.province}}). Capacidad: {{beach.capacity}} personas</p>

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
  background-color: #ebecf1;

  margin-bottom: 1rem;
}
section#info {
  text-align: left;
  margin-left: 1rem;
}
img {
  width: 150px;
  border-radius: 1em;
}

h1 {
  font-size: 0.8rem;
  text-align: left;
  color: #202441;
  margin: 1rem;
}
p {
  font-size: 0.5rem;
  font-weight: 800;
  color: #202441;
}
div#graphics {
  display: flex;
  justify-content: space-evenly;
}
button#rating {
  background-color: rgb(0, 217, 255);
  font-size: 0.6rem;
  font-weight: 700;
}
button.link,
button#free {
  width: 60px;
  font-size: 0.6rem;
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
a {
  text-decoration: none;
}
ul {
  display: flex;
  justify-content: center;
  margin: 0;
  padding: 0;
  list-style: none;
}
li {
  font-size: 0.5rem;
  margin-right: 0.5rem;
  font-weight: 800;
  color: rgb(148, 108, 7);
}
li.sun {
  background-size: cover;
  width: 10px;
  height: 10px;
  font-size: 0;
  margin: 0;
}
li.sun1 {
  background-image: url(../../assets/sun1.png);
}
li.sun2 {
  background-image: url(../../assets/sun2.png);
}
li.sun3 {
  background-image: url(../../assets/sun3.png);
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
  li {
    font-size: 0.7rem;
  }
  li.sun {
    width: 20px;
    height: 20px;
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
      font-size: 2.5rem;
      padding: 1rem;
    }
    p {
      font-size: 1.3rem;
      padding: 1rem;
    }
    img {
      padding: 1rem;
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
    li {
      font-size: 1.7rem;
    }
    li.sun {
      width: 30px;
      height: 30px;
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
      li {
        font-size: 2rem;
      }
      li.sun {
        width: 40px;
        height: 40px;
      }
    }
  }
}
</style>