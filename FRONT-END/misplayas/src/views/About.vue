<template>
  <div class="about">
    <vue-headful title="misplayas | About" />

    <h1>Datos del Proyecto</h1>

    <h2>Bootcamp Programación Full Stack. Hack a Boss. JSB06CO.</h2>
    <h3>Proyecto final nº11: Reserva de espacio en playas.</h3>

    <div id="main">
      <section id="author">
        <h3>Realizado por: Raquel Canosa Raña</h3>
        <img src="../assets/Yo.jpg" />
        <article class="contact">
          <a class="linkedin" href="https://es.linkedin.com/in/raquelcanosara">Linkedin</a>
          <a class="mail" href="mailto:denebolaleo1@gmail.com">Mail</a>
        </article>
      </section>

      <section id="sources">
        <h3>Fuentes externas utilizadas:</h3>
        <ul>
          <li>
            Iconos diseñados por
            <a
              href="https://www.flaticon.es/autores/xnimrodx"
              title="xnimrodx"
            >xnimrodx</a> de
            <a class="icons" href="https://www.flaticon.es/" title="Flaticon">www.flaticon.es</a>
          </li>
          <li>
            Información de playas (ubicación, descripción y servicios):
            <a
              href="https://opendata.arcgis.com/"
            >API guía playas del Miteco</a>
          </li>
          <li>
            Información meteorológica de playas: API MeteoSIX (
            <a
              href="http://servizos.meteogalicia.es/apiv3"
            >Meteogalicia</a>)
          </li>
          <li>
            Fotografías:
            <a href="https://unsplash.com/">Unsplash</a>,
            <a href="https://randomuser.me/">randomuser.me</a>
          </li>
          <li>
            Datos simulados de usuarios, fechas, datos de pago:
            <a
              href="https://libraries.io/npm/faker"
            >faker.js</a>
            ,
          </li>
        </ul>
      </section>

      <section id="thanks">
        <h3>Agradecimientos</h3>
        <p>
          A todos mis compañeros en Hack a Boss, muy especialmente a aquéllos con los que he compartido horas programando, ideas, preocupaciones y algunas risas.
          A Hack a Boss, la organización y sobre todo a los profesores y su paciencia.
        </p>
        <img id="thanks" src="../assets/thanks.jpg" alt="thanks" />
      </section>
    </div>
  </div>
</template>



<style scoped>
div.about {
  min-height: 100vh;
  background-color: #ebecf1;
  padding: 0.5rem;
}
h1 {
  font-size: 1.2rem;
}
h2 {
  font-size: 1rem;
}
h3 {
  font-size: 0.8rem;
}

p,
li,
a {
  font-size: 0.7rem;
  text-align: left;
}

ul {
  text-align: left;
}
img {
  width: 45%;
}
article.contact {
  display: flex;
  justify-content: center;
}
a {
  color: #353a64;
  display: inline;
}

a.linkedin,
a.mail {
  display: block;
  width: 10px;
  height: 10px;
  margin: 0 0.3rem;
  font-size: 0;
  background-size: 10px 10px;
}
a.linkedin {
  background-image: url("../assets/Linkedin.svg");
}

a.mail {
  background-image: url("../assets/correo.png");
}
section#thanks {
  background-color: white;
  padding: 1rem;
}

img#thanks {
  width: 60%;
}
@media (min-width: 1000px) {
  div#main {
    padding: 1rem;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    width: 80%;
    margin: auto;
  }
  section {
    width: 50%;
    padding-bottom: 1.5rem;
  }
  section#thanks {
    width: 100%;
  }
  h1 {
    font-size: 2rem;
  }
  h2 {
    font-size: 1.5rem;
  }
  h3 {
    font-size: 1.2rem;
  }

  p,
  li,
  a {
    font-size: 1rem;
  }
  a.linkedin,
  a.mail {
    width: 20px;
    height: 20px;
    margin: 0.2 0.6rem;
    font-size: 0;
    background-size: 20px 20px;
  }
}
</style>
