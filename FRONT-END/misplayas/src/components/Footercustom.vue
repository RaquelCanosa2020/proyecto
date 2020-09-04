<template>
  <div class="footer">
    <footer id="footer">
      <router-link :to="{name:'About'}">Raquel Canosa Raña. 2020</router-link>||
      <router-link :to="{name:'Privacidad'}">Política de Privacidad</router-link>
    </footer>
  </div>
</template>

<script>
export default {
  name: "FooterCustom",
};
</script>

<style scoped>
.footer {
  font-weight: bold;
  color: #ebecf1;
  margin-bottom: 1rem;
  font-size: 0.5rem;
}
a {
  color: white;
  margin: 0 1rem;
}

@media (min-width: 700px) {
  footer {
    font-size: 0.8rem;
  }
}
@media (min-width: 1000px) {
  footer {
    font-size: 1rem;
  }
}
</style>