<template>
  <div id="app">
    <div id="nav">
      <router-link :to="{name:'Home'}">Home</router-link>|
      <router-link :to="{name:'Buscador'}">Buscador</router-link>|
      <router-link :to="{name:'About'}">About</router-link>|
      <router-link v-show="!logged" :to="{name:'Login'}">Login</router-link>|
      <router-link v-show="logged" :to="{name:'Usuario'}">Mi perfil</router-link>
      <router-link v-show="!logged" :to="{name:'Registro'}">Registro</router-link>

      <p v-show="logged">Hola {{username}}</p>
      <button v-show="logged" @click="logoutUser()">Logout</button>
    </div>
    <router-view />
  </div>
</template>

<script>
import { getAuthToken, getId, isLoggedIn, logout } from "./api/utils";
import axios from "axios";

export default {
  data() {
    return {
      userId: "",
      logged: false,
      username: "",
    };
  },
  methods: {
    setUserName(userId) {
      userId = getId();
      var self = this;

      const token = getAuthToken();
      axios.defaults.headers.common["Authorization"] = `${token}`;

      axios
        .get("http://localhost:3000/beach/users/" + userId)
        .then(function (response) {
          console.log(response.data.data);
          self.username = response.data.data.name;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    logoutUser() {
      logout();

      this.$router.push("/");
      location.reload();
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
  background-color: #eff3c6;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #4cbbb9;
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
