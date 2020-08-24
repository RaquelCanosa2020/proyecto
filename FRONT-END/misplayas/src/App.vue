<template>
  <div id="app">
    <div id="nav">
      <router-link :to="{name:'Home'}">Home</router-link>
      <router-link v-show="admin" :to="{name:'Listbeaches'}">Lista Playas</router-link>
      <router-link v-show="admin" :to="{name:'Listusers'}">Lista Usuarios</router-link>
      <router-link :to="{name:'Buscador'}">Busca y Reserva</router-link>
      <router-link :to="{name:'About'}">About</router-link>
      <router-link v-show="!logged" :to="{name:'Login'}">Login</router-link>
      <router-link v-show="logged" :to="{name:'Usuario'}">Tus cosas</router-link>
      <router-link v-show="!logged" :to="{name:'Registro'}">Registro</router-link>
    </div>

    <section id="header">
      <p v-show="logged">Hola {{username}}</p>
      <button id="logout" v-show="logged" @click="logoutUser()">Logout</button>
    </section>

    <router-view @login="setUserName" />
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
    };
  },
  methods: {
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
@import url("https://fonts.googleapis.com/css2?family=Delius&display=swap");
#app {
  font-family: Arial, Helvetica, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #353a64;
  background-image: url(./assets/sillas.jpg);
  background-size: cover;
}

section#header {
  display: flex;
  justify-content: flex-end;
  margin-right: 3rem;
  margin-top: -5rem;
  font-size: 1.7rem;
  font-weight: bold;
}

#nav {
  padding: 30px 0 100px 0;
}

#nav a {
  font-weight: bold;
  color: #ebecf1;
  font-size: 1.3rem;
  padding: 1rem;
}

#nav a.router-link-exact-active {
  color: #086972;
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
}

button {
  width: 50px;
  height: 20px;
  margin: 2rem 1rem;
  border-style: none;
  border-radius: 2em;
  color: #ebecf1;
  background-color: #0779e4;
  font-size: 0.5rem;
}
button:hover {
  border-style: none;
}

button#logout {
  position: relative;
  margin-top: 1rem;
  margin-right: 2rem;
}

p.error {
  font-size: 1.5rem;
  color: brown;
}

p.ok {
  font-size: 1.5rem;
  color: green;
}

@media (min-width: 700px) {
  button {
    width: 100px;
    height: 40px;
    font-size: 1rem;
  }
  input {
    font-size: 1rem;
    margin: 1rem;
  }
  #nav a {
    font-weight: bold;

    font-size: 1.7rem;
  }
}
@media (min-width: 1000px) {
  input {
    font-size: 1rem;
  }
}
</style>
