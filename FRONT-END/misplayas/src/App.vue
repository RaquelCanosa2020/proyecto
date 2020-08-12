<template>
  <div id="app">
    <div id="nav">
      <router-link :to="{name:'Home'}">Home</router-link>|
      <router-link :to="{name:'Listbeaches'}">Lista Playas</router-link>|
      <router-link :to="{name:'Listusers'}">Lista Usuarios</router-link>|
      <router-link :to="{name:'Buscador'}">Buscador</router-link>|
      <router-link :to="{name:'About'}">About</router-link>|
      <router-link v-show="!logged" :to="{name:'Login'}">Login</router-link>|
      <router-link v-show="logged" :to="{name:'Usuario'}">Mi perfil</router-link>
      <router-link v-show="!logged" :to="{name:'Registro'}">Registro</router-link>

      <p v-show="logged">Hola {{username}}</p>
      <button v-show="logged" @click="logoutUser()">Logout</button>
    </div>
    <router-view />
    <footercustom />
  </div>
</template>

<script>
import { getAuthToken, getId, isLoggedIn, logout } from "./api/utils";
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
    };
  },
  methods: {
    async setUserName(userId) {
      userId = getId();
      const token = getAuthToken();
      axios.defaults.headers.common["Authorization"] = `${token}`;
      try {
        const response = await axios.get(
          "http://localhost:3000/beach/users/" + userId
        );

        this.username = response.data.data.name;
      } catch (error) {
        console.log(error);
      }
    },
    logoutUser() {
      logout();
      this.logged = false;
      this.$router.push("/login");
      /*setTimeout(() => {
        location.reload();

        // window.history.back();
      }, 1000);*/
    },
    getLoging() {
      this.logged = isLoggedIn();
    },
  },
  created() {
    this.setUserName();
    this.getLoging();
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #353a64;
  background-image: url(./assets/sillas.jpg);
  background-size: cover;
  min-height: 100vh;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #ebecf1;
  font-size: 1.3rem;
}

#nav a.router-link-exact-active {
  color: #0779e4;
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
}
@media (min-width: 1000px) {
  input {
    font-size: 1rem;
  }
}
</style>
