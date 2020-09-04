<template>
  <div id="app">
    <section id="header">
      <nav id="nav">
        <img id="header" src="./assets/mar.jpg" />
        <router-link :to="{name:'Home'}">Home</router-link>
        <router-link v-show="admin" :to="{name:'Listbeaches'}">Lista Playas</router-link>
        <router-link v-show="admin" :to="{name:'Listusers'}">Lista Usuarios</router-link>
        <router-link :to="{name:'Buscador'}">Buscar</router-link>
        <router-link v-show="logged" :to="{name:'Reserva'}">Reservar</router-link>

        <router-link v-show="!logged" :to="{name:'Login'}">Login</router-link>
        <router-link v-show="logged" :to="{name:'Usuario'}">Tu espacio</router-link>
        <router-link v-show="!logged" :to="{name:'Registro'}">Registro</router-link>
      </nav>
      <article id="username">
        <p id="username" v-show="logged">Hola {{username}}</p>
        <button id="logout" v-show="logged" @click="logoutUser()">Logout</button>
      </article>
    </section>
    <router-view
      @login="setUserName"
      @getInfo="saveInfo"
      :info="info"
      @sendToReserve="saveData"
      :datos="datos"
    />
    <footercustom />
  </div>
</template>

<script>
import {
  getAuthToken,
  getId,
  checkIsAdmin,
  isLoggedIn,
  logout,
} from "./api/utils";
import axios from "axios";
import footercustom from "@/components/Footercustom.vue";

export default {
  components: {
    footercustom,
  },
  data() {
    return {
      userId: "",
      logged: false,
      username: "",
      admin: false,
      info: {},
      datos: {},
    };
  },
  methods: {
    //Guardo las opciones del buscador para pasarlas a otras páginas
    saveInfo(infoOptions) {
      this.info = infoOptions;
    },
    //Guardo info de la playa seleccionada en buscador
    saveData(beachdata) {
      this.datos = beachdata;
    },
    //Una vez logado, se recoge el nombre del usuario para mostrarlo en el menú.
    async setUserName(userId) {
      //incluyo este ifelse, para que en la parte pública no pida el nombre del usuario,
      //para que no de error en la consola (ya que no encuentra al usuario id null)
      this.getLoging();
      if (this.logged === false) {
        console.log("usuario no registrado");
      } else {
        userId = getId();
        const token = getAuthToken();
        axios.defaults.headers.common["Authorization"] = `${token}`;
        try {
          const response = await axios.get(
            "http://localhost:3000/beach/users/" + userId
          );
          this.userId = userId;
          this.username = response.data.data.name;
          this.isAdmin();
        } catch (error) {
          console.log(error);
        }
      }
    },

    getLoging() {
      this.logged = isLoggedIn();
    },

    isAdmin(userId) {
      userId = getId();
      let log = isLoggedIn(userId);
      let role = checkIsAdmin(userId);
      if (log === true && role === true) {
        this.admin = true;
      }
    },

    logoutUser() {
      logout();
      this.username = "";
      this.logged = false;
      this.admin = false;
      this.$router.push("/login");
    },
  },
  created() {
    this.setUserName();
    this.getLoging();
    this.isAdmin();
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Be+Vietnam:wght@300&Open+Sans:wght@600display=swap");

div#app {
  font-family: Be Vietnam, Helvetica, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #353a64;
  background-size: cover;
  background-color: #353a64;
}

section#header {
  padding-top: 0.5rem;
  margin-right: 0.5rem;
  font-size: 1rem;
  font-weight: bold;
}
article#username {
  display: flex;
  justify-content: flex-end;
  margin-top: 0.5rem;
}

#nav {
  /*padding: 30px 0 50px 0;*/
  display: flex;
  justify-content: flex-start;
  background-color: #353a64;
}

#nav a {
  font-weight: bold;
  color: #ffaa71;
  font-size: 0.5rem;
  padding: 0.3rem;
  text-decoration: none;
}

#nav a.router-link-exact-active {
  color: #4cbbb9;
}
input {
  background-color: #ebecf1;
  border: 1px solid #0779e4;
  border-radius: 1em;
  font-size: 0.5rem;
  text-align: left;
  margin: 0.5rem;
}
input::placeholder {
  color: #4cbbb9;
  font-size: 0.7rem;
}

button {
  width: 50px;
  height: 20px;
  border-style: none;
  border-radius: 1em;
  border: solid #353a64 0.5px;
  color: #353a64;

  font-size: 0.5rem;
}
button:hover {
  border-style: none;
  background-color: #ffaa71;
}

button#logout {
  position: relative;
  width: 40px;
  height: 10px;
  font-size: 0.5rem;
}
p#username {
  color: #ffaa71;
  padding-right: 1rem;
  font-size: 0.3rem;
}

p {
  color: #353a64;
}

p.error {
  font-size: 1.5rem;
  color: brown;
}

p.ok {
  font-size: 1.5rem;
  color: green;
}
img#header {
  width: 40px;
  height: 20px;
}

@media (min-width: 700px) {
  button {
    width: 100px;
    height: 40px;
    font-size: 1rem;
    text-decoration: none;
  }
  button#logout {
    position: relative;
    margin-top: 1rem;
    margin-right: 2rem;
    font-size: 1rem;
    width: 100px;
    height: 40px;
  }
  input {
    font-size: 1rem;
  }
  #nav a {
    font-weight: bold;
    font-size: 1.2rem;
    padding: 1rem;
  }

  p#username {
    color: #ffaa71;
    padding-right: 1rem;
    font-size: 1.3rem;
  }
  p.error,
  p.ok {
    font-size: 1rem;
  }

  img#header {
    width: 100px;
    height: 70px;
  }
  input::placeholder {
    color: #4cbbb9;
    font-size: 1rem;
  }
}
@media (min-width: 1000px) {
  input {
    font-size: 1rem;
  }
  #nav a {
    font-size: 1.7rem;
    padding: 1rem;
  }
  button {
    width: 120px;
    height: 40px;
    font-size: 1rem;
    text-decoration: none;
  }
}
@media (min-width: 1025px) {
  section#header {
    display: flex;
    justify-content: space-between;
    margin-right: 3rem;
    font-size: 1rem;
  }
}
</style>
