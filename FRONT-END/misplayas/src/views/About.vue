<template>
  <div class="about">
    <vue-headful title="misplayas | About" />
    <h1>POLÍTICA DE PRIVACIDAD Y AVISO LEGAL</h1>
    <button v-show="!privacy" @click="privacy = true">Desplegar</button>
    <button v-show="privacy" @click="privacy = false">Ocultar</button>
    <img v-show="privacy" src="../assets/politica.jpg" />

    <h1>Datos del Proyecto</h1>
    <h2>Proyecto final realizado por Raquel Canosa Raña. Bootcamp programación Hack a Boss</h2>
    <div id="down">
      <section id="sources">
        <h2>Fuentes externas utilizadas:</h2>
        <ul>
          <li>
            Iconos diseñados por Icon made by Pixel perfect from www.flaticon.com
            Iconos diseñados por
            <a
              href="https://www.flaticon.es/autores/freepik"
              title="Freepik"
            >Freepik</a> from
            <a href="https://www.flaticon.es/" title="Flaticon">www.flaticon.es</a>
          </li>
          <li>Información meteorológica de playas: API MeteoSIX (Meteogalicia)</li>
          <li>Fotografías: Unsplash, randomuser.me</li>
          <li>Información de playas (la parte real: ubicación, descripción y servicios): API guía playas del Miteco.</li>
        </ul>
      </section>
      <section id="thanks">
        <h2>Agradecimientos</h2>
        <p>
          A todos mis compañeros en Hack a Boss, muy especialmente a aquéllos con los que he compartido horas programando, ideas, preocupaciones y algunas risas.
          A Hack a Boss, la organización y sobre todo a los profesores y su paciencia.
        </p>
      </section>
    </div>
    <img id="thanks" v-show="!privacy" src="../assets/thanks.jpg" alt="thanks" />
  </div>
</template>
<script>
export default {
  data() {
    return {
      privacy: false,
    };
  },
};
</script>


<style scoped>
div.about {
  min-height: 100vh;
  background-color: #ebecf1;
}
div#down {
  display: flex;
}

section {
  width: 50%;
}
section#sources p {
  font-size: 1.2rem;
}
section#thanks {
  width: 50%;
}

section#thanks p {
  font-size: 1.2rem;
}
ul {
  text-align: left;
}
img {
  width: 65%;
}
img#thanks {
  width: 40%;
}
</style>
