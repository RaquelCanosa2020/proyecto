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
div.about {
  height: 100vh;
  width: 100vw;
  color: #222831;
}
p {
  font-size: 8rem;
}
img {
  width: 80%;
}
</style>