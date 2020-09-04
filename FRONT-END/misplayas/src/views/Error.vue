<template>
  <!--PÃ¡gina de error-->
  <div class="error">
    <vue-headful title="Error" />
    <p>NOT FOUND!!</p>
    <img src="https://media.giphy.com/media/XfyroVlIQFz0Y/giphy.gif" />
  </div>
</template>

<script>
export default {
  name: "Error",
};
</script>

<style scoped>
div.error {
  height: 100vh;
  background-image: url("");
  background-size: cover;
}
p {
  font-size: 2rem;
  font-weight: 800;
  color: white;
  background-color: #353a64;
}
img {
  width: 85%;
}
@media (min-width: 700px) {
  p {
    font-size: 4rem;
  }
}
</style>