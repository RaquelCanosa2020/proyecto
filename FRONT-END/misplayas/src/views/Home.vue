<template>
  <div class="home">
    <vue-headful title="Galiplaya | Home" />

    <section id="up">
      <h1>Galiplaya</h1>
      <h2>Reserva sitio en tu playa favorita</h2>
    </section>
    <section id="down">
      <article id="search">
        <p>Buscador rápido de playas:</p>
        <select v-model="selectedBeach">
          <option
            v-for="beach in beaches"
            :key="beach.id"
            :value="beach.id"
          >{{beach.name}}, {{beach.municipality}}</option>
        </select>
        <section id="button">
          <p>
            <button v-if="selectedBeach !== null" class="link">
              <router-link :to="{name:'Playa', params: {id:selectedBeach}}">Ir</router-link>
            </button>
            <button v-else class="link">Ir</button>
          </p>

          <p>
            <button class="link">
              <router-link :to="{name:'Buscador'}">Avanzado</router-link>
            </button>
          </p>
        </section>
      </article>
      <ul>
        <li>
          <img src="../assets/lupa.png" />
          Utiliza nuestra web para
          <span>
            <router-link to="/Buscador">BUSCAR</router-link>
          </span> tu playa.
        </li>
        <li>
          <img src="../assets/usuario.png" />
          <span>
            <router-link to="/Register">REGÍSTRATE</router-link>
          </span>
          y
          <span>
            <router-link to="/login">ENTRA</router-link>
          </span> para poder reservar tu plaza.
        </li>

        <li>
          <img src="../assets/storyboard.png" />
          Desde la sección
          <span>
            <router-link to="/login">TU ESPACIO</router-link>
          </span> podrás gestionar tus datos, tus reservas, subir fotos...
        </li>
      </ul>
    </section>
  </div>
</template>
<script>
import axios from "axios";
export default {
  name: "Home",
  data() {
    return {
      beaches: [],
      selectedBeach: null,
    };
  },

  methods: {
    //FUNCIÓN PARA OBTENER LOS DATOS DE LAS PLAYAS

    async getBeaches() {
      console.log("empiezo");
      try {
        const response = await axios.get(
          `http://localhost:3000/beaches?order=name`
        );
        console.log(response.data);

        this.beaches = response.data.data;
      } catch (error) {
        console.log(error);
      }
    },
  },

  created() {
    this.getBeaches();
  },
};
</script>
<style scoped>
div.home {
  background-image: url(../assets/paso.jpg);
  background-size: cover;
  height: 100vh;
}
section#up {
  height: 50%;
}
select {
  width: 100px;
  height: 15px;
  margin: 0;
  font-size: 0.7rem;
}

section#down {
  height: 50%;
  padding: 0.5rem;
  width: 60%;
}
h1 {
  margin: 0;
  font-size: 2rem;
  padding-top: 3rem;
}
h2 {
  font-size: 1rem;
}
ul {
  background-color: #ebecf1c0;
  border: solid #0779e4 1px;
  padding: 0.5rem;
  margin-bottom: 1rem;
  border-radius: 1em;
  list-style: none;
}
li {
  font-size: 0.5rem;
  color: #202441;
  text-align: left;
  margin-top: 0.5rem;
}
li:hover {
  background-color: #4cbbb9;
}
p {
  font-size: 0.7rem;
  color: white;
}

img {
  width: 10px;
  margin-right: 1rem;
}
a {
  color: rebeccapurple;
  text-decoration: none;
}
button {
  margin-right: 0.5rem;
}

@media (min-width: 700px) {
  p {
    font-size: 1rem;
  }
  select {
    width: 200px;
    height: 25px;
    margin: 0;
    font-size: 1rem;
  }
  section#up {
    height: 50vh;
  }
  section#down {
    height: 50vh;
    padding: 2rem;
    flex-direction: row;
    justify-content: center;
  }

  h1 {
    font-size: 6rem;
    padding-top: 10rem;
  }
  h2 {
    font-size: 2rem;
  }
  li {
    font-size: 1rem;
    margin: 1rem;
  }
  img {
    width: 30px;
  }
  @media (min-width: 1000px) {
    section#down {
      width: 100%;
      display: flex;
      flex-direction: row-reverse;
      justify-content: space-between;
      align-items: center;
      padding: 0;
    }
    ul {
      width: 40%;
      margin-bottom: 1rem;
      margin-left: 1rem;
    }

    article {
      background-color: #0779e4;
      border-radius: 1em;
      padding: 1rem;
      margin-right: 6rem;
      margin-bottom: 3rem;
    }
    section#button {
      display: flex;
      justify-content: center;
    }
    p {
      font-size: 1.2rem;
    }
    select {
      width: 300px;
      height: 35px;
      margin: 0;
      font-size: 1.2rem;
    }

    h1 {
      font-size: 6rem;
      padding-top: 10rem;
    }
    h2 {
      font-size: 2rem;
    }
    li {
      font-size: 1.2rem;
    }
    img {
      width: 40px;
    }
  }
  @media (min-width: 1300px) {
    div.home {
      height: 90vh;
    }
    section#up {
      height: 40%;
    }

    section#down {
      height: 60%;
    }
    ul {
      width: 25%;
    }

    p {
      font-size: 1.5rem;
    }
    select {
      width: 300px;
      height: 35px;
      margin: 0;
      font-size: 1.5rem;
    }

    h1 {
      font-size: 7rem;
      padding-top: 10rem;
    }
    h2 {
      font-size: 2.5rem;
    }
    button,
    li {
      font-size: 1.5rem;
    }
    img {
      width: 40px;
    }
  }
}
</style>