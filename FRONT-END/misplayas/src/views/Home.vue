<template>
  <div class="home">
    <vue-headful title="misplayas | Home" />

    <section id="up">
      <h1>Galiplaya</h1>
      <h2>Reserva sitio en tu playa favorita</h2>
    </section>
    <section id="down">
      <h3>
        Utiliza nuestra web para encontrar las mejores playas de Galicia.
        REGÍSTRATE para poder reservar tu plaza.
      </h3>
      <h3>Si ya te has registrado, HAZ LOGIN para empezar. Utiliza el buscador y selecciona playas según tus opciones.</h3>
      <h3>Desde la sección TU ESPACIO podrás gestionar tus datos, tus reservas, subir fotos...</h3>
    </section>
  </div>
</template>
<script>
export default {
  name: "Home",
  components: {},
};
</script>
<style scoped>
div.home {
  height: 100%;
  background-image: url(../assets/paso.jpg);
  background-size: cover;
}
section#up {
  height: 30vh;
}

section#down {
  height: 70vh;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
h1 {
  margin: 0;
  font-size: 2rem;
  padding-top: 3rem;
}
h2 {
  font-size: 1rem;
}
h3 {
  font-size: 0.5rem;
  background-color: #ffaa71c5;
  width: 70%;
  height: 10%;
  margin: 1rem;
}

@media (min-width: 700px) {
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
  h3 {
    font-size: 1rem;
    background-color: #ffaa71c5;
    width: 30%;
    height: 30%;
    margin: 1rem;
    padding: 1rem;
  }
}

@media (min-width: 1000px) {
  h3 {
    font-size: 1.3rem;
    height: 20%;
  }
}
</style>