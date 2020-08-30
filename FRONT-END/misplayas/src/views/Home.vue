<template>
  <div class="home">
    <vue-headful title="misplayas | Home" />

    <section id="up">
      <h1>Galiplaya</h1>
      <h2>Reserva sitio en tu playa favorita</h2>
    </section>
    <section id="down"></section>
    <!-----<img src="https://image.flaticon.com/icons/svg/3075/3075404.svg" />----->
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
  height: 100vh;
  background-image: url(../assets/yellow.jpg);
  background-size: cover;
}
section#up {
  height: 50vh;
}

section#down {
  height: 50vh;
  padding: 2rem;
}
h1 {
  font-size: 6rem;
}
h2 {
  font-size: 2rem;
}
</style>