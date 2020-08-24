<template>
  <div class="home">
    <vue-headful title="misplayas | Buscador" />

    <!-----🔍-INICIO PANTALLA BÚSQUEDA AVANZADA----->
    <div id="list" v-show="list">
      <h1>BUSCA TU PLAYA</h1>

      <!-----OPCIONES PARA ORDENAR LAS PLAYAS--->
      <section id="order">
        <div>
          <p>Ordenar por:</p>
          <select v-model="order">
            <option value></option>
            <option value="name">Nombre</option>
            <option value="municipality">Municipio</option>
            <option value="province">Provincia</option>
            <option value="voteAverage">Valoración usuarios</option>
          </select>
        </div>
        <div>
          <p>Orden asc/desc:</p>
          <select v-model="direction">
            <option value="asc">Ascendente</option>
            <option value="desc">Descendente</option>
          </select>
        </div>
      </section>

      <!-----BUSCADOR AVANZADO (FECHA Y Nº DE PLAZAS A RESERVAR)--->

      <button @click="getAdvanced">Avanzado</button>

      <article v-show="advanced" id="advanced">
        <section id="dateplaces">
          <p>Fecha:</p>
          <input id="date" type="date" v-model="date" placeholder="fecha" />

          <p>Hora (formato 24 horas):</p>
          <select id="hour" v-model="hour">
            <option v-for="number in numbers" :key="number.id" :value="number">{{number}}</option>
          </select>

          <p>Número de plazas:</p>
          <select id="places" v-model="places">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </section>

        <!-----AVANZADO (OPCIONES Y SERVICIOS DE LAS PLAYAS)--->
        <section id="location">
          <p>Tipo de playa:</p>
          <select id="type" v-model="typeSaved">
            <option value></option>
            <option value="Urbana">Urbana</option>
            <option value="Semiurbana">Semiurbana</option>
            <option value="Aislada">Aislada</option>
          </select>

          <p>Provincia:</p>
          <select id="province" v-model="provinceSaved">
            <option value></option>
            <option value="A Coruña">A Coruña</option>
            <option value="Lugo">Lugo</option>
            <option value="Ourense">Ourense</option>
            <option value="Pontevedra">Pontevedra</option>
          </select>

          <p>Municipio:</p>
          <select id="municipality" v-model="municipalitySaved">
            <option
              :class="{hidden: provinceSaved !== muni.province}"
              v-for="muni in beachesMun"
              :key="muni.id"
              :value="muni.municipality"
            >{{muni.municipality}}</option>
          </select>
        </section>

        <section id="options">
          <label>
            <img src="@/assets/lifesaving.png" />
          </label>
          <input type="checkbox" value="lifesaving" v-model="lifesavingSaved" />

          <label>
            <img src="@/assets/bar_restaurant.png" />
          </label>
          <input type="checkbox" value="bar_restaurant" v-model="bar_restaurantSaved" />

          <label>
            <img src="@/assets/disabled_access.png" />
          </label>
          <input type="checkbox" value="disabled_access" v-model="disabled_accessSaved" />

          <label>
            <img src="@/assets/parking.png" />
          </label>
          <input type="checkbox" value="parking" v-model="parkingSaved" />

          <label>
            <img src="@/assets/toilet.png" />
          </label>
          <input type="checkbox" value="toilet" v-model="toiletSaved" />
        </section>
        <button @click="hide">Volver a sencillo</button>
      </article>

      <!--------FIN BUSCADOR AVANZADO--->

      <button @click="searchBeaches()">Buscar</button>

      <!---IMPORTAMOS EL COMPONENTE PARA LISTAR LAS PLAYAS
      ENVIAMOS DOS EVENTOS, UNO PARA COMENZAR UNA RESERVA Y OTRO PARA VER UNA PLAYA---->

      <searchbeachescomponent
        v-on:sendDataReserve="seeData"
        v-on:sendIdShow="showData"
        :beaches="beaches"
      />
    </div>
    <!------🔍-FIN ID LIST-BÚSQUEDA AVANZADA---->

    <!------📑-SECCIÓN DE INFO PRINCIPAL DE LA PLAYA--->
    <div id="info" v-show="info">
      <article id="up">
        <section id="data">
          <h1>INFORMACIÓN COMPLETA DE LA PLAYA</h1>
          <p>Id: {{beachId}}.Nombre: {{name}}, Municipio: {{municipality}}</p>
          <p>Provincia: {{province}}</p>
          <p>Tipo: {{type}}</p>
          <p>Descripción: {{description}}</p>
          <p>Capacidad: {{capacity}} personas</p>
          <p>{{disponibilidad}}</p>
          <p>{{notice}}</p>
          <p>Horario: de {{start_time}} a {{end_time}}</p>
          <p>Meses de reserva obligatoria: de {{nameMonth(start_month)}} a {{nameMonth(end_month)}}</p>
          <p>Valoración media de usuarios usuarios: {{voteAverage}}</p>
          <p>Servicios:</p>
          <ul>
            <li>
              <img src="@/assets/lifesaving.png" />
              {{lifesaving}}
            </li>
            <li>
              <img src="@/assets/parking.png" />
              {{parking}}
            </li>
            <li>
              <img src="@/assets/toilet.png" />
              {{toilet}}
            </li>
            <li>
              <img src="@/assets/bar_restaurant.png" />
              {{bar_restaurant}}
            </li>
            <li>
              <img src="@/assets/disabled_access.png" />
              {{disabled_access}}
            </li>
          </ul>

          <img id="principal" :src="setImage(image)" />
          <p>
            <img id="sky" :src="skyState" />
          </p>
          <p>{{temperature}} ºC</p>
          <button @click="comeback()">Volver al Buscador</button>
        </section>

        <!-------📸-SECCIÓN DE FOTOS DE LA PLAYA HECHAS POR USUARIOS--->
        <section id="photos">
          <h2>Fotos de los usuarios</h2>

          <!--IMPORTAMOS COMPONENTE DE FOTOS--->
          <photoscomponent :photos="photos" />
          <p>{{errorMessagePhotos}}</p>
        </section>
      </article>

      <article id="down">
        <!-------👍-SECCIÓN DE RATING Y OPINIONES--->
        <section id="rating">
          <h2>Valoraciones y comentarios de los usuarios</h2>

          <!--IMPORTAMOS COMPONENTE DE RATINGS--->

          <ratingscomponent :global="global" :votes="votes" />

          <p>{{errorMessageVotes}}</p>
        </section>
      </article>
    </div>

    <!------📑-FIN SECCIÓN DE INFO PRINCIPAL DE LA PLAYA--->

    <!-------⌚-INICIO RESERVA--->
    <div id="reservation" v-show="reservation">
      <p>Playa: Nº.{{beachId}}, {{name}}</p>
      <p>Municipio: {{municipality}}, Provincia: {{province}}</p>

      <!-------FECHA Y Nº DE PLAZAS A RESERVAR--->
      <section id="dateplaces">
        <p>Fecha:</p>
        <input id="date" type="date" v-model="dateReservation" placeholder="fecha" />

        <p>Hora (formato 24 horas):</p>
        <select id="hour" v-model="hourReservation">
          <option v-for="number in numbers" :key="number.id" :value="number">{{number}}</option>
        </select>

        <p>Número de plazas:</p>
        <select v-model="placesReservation">
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
      </section>
      <section id="conditions">
        <!-------CONFIRMACIÓN DE LA RESERVA--->
        <p>Condiciones generales de la reserva:</p>

        <p>Número de tarjeta de crédito</p>:
        <input
          id="ccNumber"
          type="text"
          v-model="ccNumber"
          placeholder="Nº tarjeta crédito/débito"
        />

        <p>Importe: 3 euros (impuestos incluídos)</p>
      </section>

      <ul class="ok" id="reserv" v-show="reservInfo">
        <li>{{messageConfirm.info}}</li>
        <li>{{messageConfirm.user}}</li>
        <li>{{messageConfirm.beach}}</li>
        <li>{{messageConfirm.visit}}</li>
        <li>{{messageConfirm.places}}</li>
        <li>{{messageConfirm.fee}}</li>
        <li>{{messageConfirm.payment}}</li>
        <li>{{messageConfirm.notice}}</li>
      </ul>

      <button v-show="beforeConfirm" @click="acceptReservation">Confirmar y pagar</button>

      <button @click="comeback()">Volver</button>
    </div>

    <!-------⌚-FIN RESERVA--->
  </div>
</template>

<script>
import axios from "axios";
import spinner from "@/components/Spinner.vue";
import searchbeachescomponent from "../../components/beachcomponents/Searchbeachescomponent.vue";
import photoscomponent from "../../components/beachcomponents/Photoscomponent.vue";
import ratingscomponent from "../../components/beachcomponents/Ratingscomponent.vue";
import {
  getAuthToken,
  getId,
  setServices,
  sweetAlertNotice,
  sweetAlertOk,
} from "../../api/utils";
export default {
  name: "Advancedsearch",
  components: {
    searchbeachescomponent,
    photoscomponent,
    ratingscomponent,
    spinner,
  },
  data() {
    return {
      beaches: [],
      beachesMun: [],
      order: "",
      direction: "",
      list: true,
      advanced: false,
      info: false,
      reservation: false,
      visit: "",
      visitReservation: "",
      places: "",
      placesReservation: "",
      beachId: null,
      name: "",
      municipality: "",
      municipalitySaved: "",
      province: "",
      provinceSaved: "",
      description: "",
      type: "",
      typeSaved: "",
      capacity: "",
      free: "",
      disponibilidad: "",
      notice: "",
      start_time: "",
      end_time: "",
      start_month: "",
      end_month: "",
      voteAverage: "",
      lifesaving: false,
      lifesavingSaved: false,
      bar_restaurant: false,
      bar_restaurantSaved: false,
      disabled_access: false,
      disabled_accessSaved: false,
      parking: false,
      parkingSaved: false,
      toilet: false,
      toiletSaved: false,
      disponibilidad: "",
      image: "",
      ccNumber: "",
      messageConfirm: {},
      date: "",
      dateReservation: "",
      hourReservation: "",
      hour: "",
      numbers: [],
      image: "",
      global: "",
      votes: [],
      photos: [],
      errorMessagePhotos: "",
      errorMessageVotes: "",
      reservInfo: false,
      spinner: true,
      beforeConfirm: false,
      skyState: "",
      temperature: "",
    };
  },

  methods: {
    //PARA CONSEGUIR MUNICIPIOS DE LAS PLAYAS EN LA BD

    async getAdvanced() {
      try {
        const response = await axios.get(
          "http://localhost:3000/beaches/municipalities"
        );
        this.beachesMun = response.data.data.info;
        console.log(response.data.data.info);

        this.getNumber();
        this.advanced = true;
      } catch (error) {
        sweetAlertNotice(error.response.data.message);
      }
    },

    //FUNCIÓN PARA GENERAR LAS HORAS EN EL BUSCADOR
    getNumber() {
      let arrayNumber = [""];
      for (let number = 0; number <= 24; number++) {
        if (number < 10) {
          number = "0" + number;
        } else {
          number = number;
        }
        arrayNumber.push(number);
      }
      this.numbers = arrayNumber;
    },

    //FUNCIÓN PARA CONSEGUIR VISIT A PARTIR DE FECHA Y HORA QUE INTRODUZCA EL USUARIO
    getVisit(date, hour) {
      let datehour = "";

      if (date === "" || hour === "") {
        datehour = "";
      } else {
        datehour = date + "T" + hour + ":" + "00";
      }
      console.log(datehour);
      return datehour;
    },

    //FUNCIÓN PARA  OCULTAR BÚSQUEDA AVANZADA, Y QUE BORRE LAS OPCIONES
    hide() {
      this.advanced = false;
      location.reload();
    },

    //FUNCIÓN PARA BUSCAR PLAYAS CON/SIN CRITERIOS DE BÚSQUEDA
    async searchBeaches() {
      let visit = this.getVisit(this.date, this.hour); //MONTAMOS VISIT
      this.info = false;
      this.reservation = false;
      this.list = true; //PARA QUE SOLO SE VEA LA LISTA

      //LLAMADA DE AXIOS A LA API

      try {
        const response = await axios.post(
          `http://localhost:3000/beaches/search?order=${this.order}&direction=${this.direction}`,
          {
            lifesaving: this.lifesavingSaved,
            bar_restaurant: this.bar_restaurantSaved,
            disabled_access: this.disabled_accessSaved,
            parking: this.parkingSaved,
            toilet: this.toiletSaved,
            visit: visit,
            places: this.places,
            type: this.typeSaved,
            municipality: this.municipalitySaved,
            province: this.provinceSaved,
          }
        );
        this.beaches = response.data.data;
      } catch (error) {
        sweetAlertNotice(error.response.data.message);
      }
    },

    //FUNCIÓN PARA  VOLVER AL BUSCADOR, QUE SÓLO SE VEA EL LISTADO ,
    //QUE BORRE EL AVISO DE LA RESERVA, DATOS Y TARJETA
    //Y QUE SE MANTENGAN LAS OPCIONES DEL BUSCADOR
    comeback() {
      //BORRAR FOTOS Y VOTOS Y MENSAJES DE LA PLAYA QUE ACABA DE MOSTRAR (SI NO, APARECE LO DEL ANTERIOR):
      this.votes = [];
      this.photos = [];
      this.errorMessagePhotos = "";
      this.errorMessageVotes = "";

      //PARA QUE OCULTE LA INFO DE LA RESERVA Y VUELVA A LA LISTA
      this.reservation = false;
      this.notice = false;
      this.info = false;
      this.list = true;
      this.visitReservation = "";
      this.placesReservation = "";
      this.ccNumber = "";
      this.reservInfo = "";

      //PARA QUE GUARDE LAS OPCIONES QUE SELECCIONÓ EL USUARIO ANTES VER O RESREVAR PLAYA
      this.lifesaving = this.lifesavingSaved;
      this.bar_restaurant = this.bar_restaurantSaved;
      this.disabled_access = this.disabled_accessSaved;
      this.parking = this.parkingSaved;
      this.toilet = this.toiletSaved;
      this.type = this.typeSaved;
      this.province = this.provinceSaved;
      this.municipality = this.municipalitySaved;
    },

    //FUNCIÓN PARA VER LOS DATOS DE UNA PLAYA CON/SIN DISPONIBILIDAD
    async showData(beachId) {
      let visit = this.getVisit(this.date, this.hour);
      this.list = false;
      this.info = true;
      this.reservation = false;
      try {
        const response = await axios.post(
          `http://localhost:3000/beaches/${beachId}/show`,
          {
            visit: visit,
          }
        );

        const beachData = response.data.data.info;
        console.log(response.data.data);

        this.beachId = beachData.id;
        this.name = beachData.name;
        this.municipality = beachData.municipality;
        this.province = beachData.province;
        this.description = beachData.description;
        this.type = beachData.type;
        this.capacity = beachData.capacity;
        this.start_time = beachData.start_time;
        this.end_time = beachData.end_time;
        this.start_month = beachData.start_month;
        this.end_month = beachData.end_month;
        this.voteAverage = beachData.voteAverage;
        this.lifesaving = setServices(beachData.lifesaving);
        this.parking = setServices(beachData.parking);
        this.toilet = setServices(beachData.toilet);
        this.bar_restaurant = setServices(beachData.bar_restaurant);
        this.disabled_access = setServices(beachData.disabled_access);
        this.image = beachData.image;
        this.disponibilidad = response.data.data.disponibilidad;
        this.notice = response.data.data.aviso;
        this.skyState = response.data.data.estado;
        this.temperature = response.data.data.temperatura;
      } catch (error) {
        sweetAlertNotice(error.response.data.message);
      }
      this.seeVotes(beachId);
      this.seePhotos(beachId);
    },
    //FUNCIÓN PARA ASIGNAR NOMBRE A LOS MESES EN LA INFO DE LA PLAYA
    nameMonth(number) {
      const monthNames = [
        "enero",
        "febrero",
        "marzo",
        "abril",
        "mayo",
        "junio",
        "julio",
        "agosto",
        "septiembre",
        "octubre",
        "noviembre",
        "diciembre",
      ];

      return monthNames[number - 1];
    },

    //FUNCIÓN PARA COMENZAR LA RESERVA

    seeData(beachData) {
      const idUser = getId();
      if (idUser === null) {
        this.$router.push("/login"); //SI NO ESTÁ LOGEADO, LO MANDA AL LOGIN
      } else {
        this.list = false;
        this.info = false;
        this.reservation = true;
        this.beforeConfirm = true;
        //SE GENERAN LAS HORAS
        this.getNumber();
        //SI HAY FECHA, HORA Y PLAZAS EN EL BUSCADOR, SE PASAN A LA RESERVA (SE PUEDEN CAMBIAR)
        this.dateReservation = this.date;
        this.hourReservation = this.hour;
        this.placesReservation = this.places;
        this.beachId = beachData.id;
        this.name = beachData.name;
        this.municipality = beachData.municipality;
        this.province = beachData.province;
      }
    },

    //FUNCIÓN PARA PAGAR Y CONFIRMAR LA RESERVA

    async acceptReservation(beachId) {
      try {
        const idUser = getId();
        console.log(idUser);
        const token = getAuthToken();

        if (!this.dateReservation || !this.hourReservation) {
          sweetAlertNotice("Debes indicar fecha y hora");
        } else {
          this.visitReservation = this.getVisit(
            this.dateReservation,
            this.hourReservation
          );
          console.log(this.visitReservation);

          axios.defaults.headers.common["Authorization"] = `${token}`;
          const response = await axios.post(
            "http://localhost:3000/reservations",
            {
              visit: this.visitReservation,
              places: this.placesReservation,
              id_beach: this.beachId,
              cc_number: this.ccNumber,
            }
          );
          this.reservInfo = true;
          this.messageConfirm = response.data.message;
          console.log(response.message);
          //UNA VEZ ACEPTADA, VACIAMOS LOS CAMPOS
          this.dateReservation = "";
          this.hourReservation = "";
          this.placesReservation = "";
          this.ccNumber = "";
          this.beforeConfirm = false;
        }
      } catch (error) {
        sweetAlertNotice(error.response.data.message);
      }
    },

    //FUNCIÓN PARA CONSEGUIR MUNICIPIOS DE LAS PLAYAS EN LA BD

    async getMunic() {
      try {
        const response = await axios.get(
          "http://localhost:3000/beaches/municipalities"
        );
        this.beachesMun = response.data.info;
        console.log(response.data);
      } catch (error) {
        sweetAlertNotice(error.response.data.message);
      }
    },

    //FUNCIÓN PARA VER LA IMAGEN PRINCIPAL (en las de usuarios se aplica al componente)
    setImage(img) {
      if (!img) {
        return this.spinner; //esto lo incluyo para que no de error en consola, ya que debe tardar
        //algo en cargar las fotos y de primeras da 404 (aunque no se llega a ver el spinner)
      } else {
        return process.env.VUE_APP_STATIC + img;
      }
    },

    //FUNCIÓN PARA VER LOS VOTOS DE UNA PLAYA
    async seeVotes(id) {
      try {
        const response = await axios.get(
          `http://localhost:3000/beaches/${id}/votes`
        );
        this.votes = response.data.data;
        this.global = response.data.rating;
      } catch (error) {
        console.log(error);
        this.errorMessageVotes = error.response.data.message;
      }
    },
    //FUNCIÓN PARA VER LAS FOTOS DE UNA PLAYA HECHAS POR USUARIOS
    async seePhotos(id) {
      try {
        const response = await axios.get(
          `http://localhost:3000/beaches/${id}/photos`
        );
        this.photos = response.data.data;
      } catch (error) {
        console.log(error);
        this.errorMessagePhotos = error.response.data.message;
      }
    },
  },
  created() {
    this.searchBeaches();
  },
};
</script>
<style scoped>
div#selected {
  width: 60%;
  margin: auto;
}

input#datetime,
input#date {
  width: 250px;
  height: 20px;
}
input#ccNumber {
  width: 500px;
  height: 20px;
}

article#advanced select {
  height: 20px;
}
input {
  width: 10px;
  height: 10px;
  font-size: 1rem;
  margin: 1rem;
}

.hidden {
  display: none;
}

section#order,
section#dateplaces,
section#location {
  display: flex;
  justify-content: center;
  margin: auto;
}
img {
  width: 80px;
}

img#sky {
  width: 70px;
  height: 70px;
}

label > img,
p > img {
  width: 30px;
}
div#list {
  width: 75%;
  margin: auto;
}
article {
  background-color: #ebecf1;
  width: 75%;
  margin: auto;
}

article#reservation {
  padding-top: 2rem;
}

ul {
  background-color: #ebecf1;
  list-style: none;
  width: 50%;
  margin: auto;
}
section#data > ul {
  display: flex;
  justify-content: space-around;
}

section#data > img {
  width: 1000px;
  margin: auto;
}

li {
  margin-bottom: 1rem;
}
</style>