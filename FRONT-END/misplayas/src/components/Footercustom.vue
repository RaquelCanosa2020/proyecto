<template>
  <div class="footer">
    <footer id="footer">
      Raquel Canosa Raña. 2020 |
      <router-link :to="{name:'About'}">Política de Privacidad</router-link>
    </footer>
  </div>
</template>

<script>
export default {
  name: "FooterCustom",
};
</script>

<style scoped>
footer {
  font-weight: bold;
  color: #ebecf1;
  margin-bottom: 1.5rem;
}
a {
  color: white;
}
</style>