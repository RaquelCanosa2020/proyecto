<template>
  <div class="all">
    <vue-headful title="Galiplaya | Reserva" />
    <div class="reservation">
      <!-------⌚-INICIO RESERVA-->
      <h1>RESERVA DE ESPACIO EN PLAYA</h1>
      <label>Elige la playa:</label>
      <select id="beach" v-model="selectedBeach">
        <option
          v-for="beach in beaches"
          :key="beach.id"
          :value="beach.id"
        >{{beach.id}}, {{beach.name}}, {{beach.municipality}}, {{beach.province}}</option>
      </select>

      <!-------FECHA Y Nº DE PLAZAS A RESERVAR--->
      <section id="dateplaces">
        <p>
          Fecha:
          <input id="date" type="date" v-model="dateReservation" placeholder="fecha" />
        </p>

        <p>
          Hora (formato 24 horas):
          <select id="hour" v-model="hourReservation">
            <option v-for="number in numbers" :key="number.id" :value="number">{{number}}</option>
          </select>
        </p>

        <p>
          Número de plazas:
          <select v-model="placesReservation">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </p>
      </section>
      <section id="conditions">
        <!-------CONFIRMACIÓN DE LA RESERVA--->
        <p>Condiciones generales de la reserva:</p>
        <ul id="conditions">
          <li>Selecciona fecha / hora / nº plazas para que se realice la reserva.</li>
          <li>Se pueden reservar fechas de los 5 días siguientes desde el momento actual.</li>
          <li>Sólo es necesario reservar dentro de los horarios y meses indicados en cada playa.</li>
          <li>Introduce el nº de tarjeta para hacer efectivo el pago de la reserva.</li>
          <li>Se puede anular la reserva hasta 24 horas antes de la fecha prevista.</li>
          <li>Desde "tu espacio" puedes ver tus reservas, anular reservas y votar/dejar comentarios.</li>
        </ul>
      </section>

      <p>Número de tarjeta de crédito:</p>
      <input id="ccNumber" type="text" v-model="ccNumber" placeholder="Nº tarjeta crédito/débito" />

      <p>Importe: 3 euros (impuestos incluídos)</p>

      <button id="pay" v-show="beforeConfirm" @click="acceptReservation">Confirmar y pagar</button>

      <ul class="ok" id="reserv">
        <li>{{messageConfirm.info}}</li>
        <li>{{messageConfirm.user}}</li>
        <li>{{messageConfirm.beach}}</li>
        <li>{{messageConfirm.visit}}</li>
        <li>{{messageConfirm.places}}</li>
        <li>{{messageConfirm.fee}}</li>
        <li>{{messageConfirm.payment}}</li>
        <li>{{messageConfirm.notice}}</li>
      </ul>

      <router-link :to="{name:'Buscador', params:{info:this.info}}">&#8592;Volver al buscador</router-link>

      <button @click="$router.go(-1)">Volver anterior</button>
      <button v-show="after" @click="seeData">Nueva reserva</button>

      <!-------⌚-FIN RESERVA--->
    </div>
  </div>
</template>

<script>
import axios from "axios";
import spinner from "@/components/Spinner.vue";
import onebeachcomponent from "@/components/beachcomponents/Onebeachcomponent.vue";

import {
  getAuthToken,
  getId,
  sweetAlertNotice,
  sweetAlertOk,
} from "../../api/utils";

export default {
  name: "Reserva",
  components: {
    spinner,
    onebeachcomponent,
  },
  props: {
    info: Object, //datos opciones buscador, almacenados en App
  },

  data() {
    return {
      beaches: [],
      selectedBeach: "",
      id: null,
      visit: "",
      visitReservation: "",
      places: "",
      placesReservation: "",
      name: "",
      municipality: "",
      province: "",
      ccNumber: "4539054178358254",
      messageConfirm: {},
      date: "",
      dateReservation: "",
      hourReservation: "",
      hour: "",
      numbers: [],
      spinner: true,
      beforeConfirm: false,
      after: false,
    };
  },
  computed: {
    //FUNCIÓN PARA CONSEGUIR VISIT A PARTIR DE FECHA Y HORA QUE INTRODUZCA EL USUARIO
    getVisit() {
      let datehour = "";

      if (this.dateReservation === "" || this.hourReservation === "") {
        datehour = "";
      } else {
        datehour =
          this.dateReservation + "T" + this.hourReservation + ":" + "00";
      }
      console.log(datehour);
      return datehour;
    },
  },
  methods: {
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

      //SI HAY FECHA, HORA Y PLAZAS EN EL BUSCADOR, SE PASAN A LA RESERVA (SE PUEDEN CAMBIAR)
      this.dateReservation = this.info.date;
      this.hourReservation = this.info.hour;
      this.placesReservation = this.info.places;
      if (this.$route.params.id) {
        this.selectedBeach = this.$route.params.id;
      } else {
        this.selectedBeach = null;
      }
    },

    //FUNCIÓN PARA CONSEGUIR LOS DATOS DE LAS PLAYAS (SI USUARIO NO VIENE DEL BUSCADOR)
    async getBeaches() {
      try {
        const response = await axios.post(
          `http://localhost:3000/beaches/search`
        );

        this.beaches = response.data.data;
      } catch (error) {
        this.errorMessage = error.response.data.message;
      }
    },
    //FUNCIÓN PARA COMENZAR LA RESERVA

    seeData(beachData) {
      const idUser = getId();
      if (idUser === null) {
        this.$router.push("/login"); //SI NO ESTÁ LOGEADO, LO MANDA AL LOGIN
      } else {
        //visualizar botón de aceptar
        this.beforeConfirm = true;
        //SE GENERAN LAS HORAS
        this.getNumber();
      }
      //borrado si hubiera info de reserva anterior
      this.messageConfirm = "";
    },

    //FUNCIÓN PARA PAGAR Y CONFIRMAR LA RESERVA

    async acceptReservation() {
      try {
        const idUser = getId();
        console.log(idUser);
        const token = getAuthToken();

        if (!this.dateReservation || !this.hourReservation) {
          sweetAlertNotice("Debes indicar fecha y hora");
        } else {
          this.visitReservation = this.getVisit;

          axios.defaults.headers.common["Authorization"] = `${token}`;
          const response = await axios.post(
            "http://localhost:3000/reservations",
            {
              visit: this.visitReservation,
              places: this.placesReservation,
              id_beach: this.selectedBeach,
              cc_number: this.ccNumber,
            }
          );

          this.messageConfirm = response.data.message;

          //UNA VEZ ACEPTADA, VACIAMOS LOS CAMPOS
          this.dateReservation = "";
          this.hourReservation = "";
          this.placesReservation = "";
          this.ccNumber = "";
          this.beforeConfirm = false;
          this.after = true;
        }
      } catch (error) {
        sweetAlertNotice(error.response.data.message);
      }
    },
  },
  created() {
    this.getBeaches();
    this.seeData();
  },
};
</script>
<style scoped>
div.all {
  min-height: 100 vh;
  background-image: url(../../assets/sillas.jpg);
  background-size: cover;
}
div.reservation {
  width: 80%;
  margin: auto;
  background-color: #ebecf1;
  padding: 1rem;
}
h1 {
  font-size: 0.8rem;
}
p,
label {
  font-size: 0.7rem;
  color: #202441;
}
select,
input {
  height: 15px;
  font-size: 0.6rem;
}
select#beach {
  width: 150px;
}
ul {
  font-size: 0.6rem;
  margin: auto;
  list-style: none;
}
ul.ok {
  background-color: #ea9a96;
}
li {
  text-align: left;
}
button#pay {
  background-color: #4cbbb9;
  height: 20px;
}
a {
  font-size: 0.6rem;
}

@media (min-width: 700px) {
  h1 {
    font-size: 1rem;
  }
  p,
  label {
    font-size: 0.8rem;
  }
  select,
  input {
    height: 30px;
    font-size: 0.8rem;
  }
  ul {
    font-size: 0.8rem;
    margin: auto;
  }
  button,
  button#pay {
    background-color: #4cbbb9;
    height: 30px;
    font-size: 0.6rem;
  }
}

@media (min-width: 1000px) {
  div.reservation {
    width: 60%;
    padding: 2rem;
  }
  h1 {
    font-size: 2rem;
  }
  p,
  label {
    font-size: 1.5rem;
  }

  select,
  input {
    height: 30px;
  }
  ul {
    font-size: 1.2rem;
  }

  ul#conditions {
    color: #353a64;
    padding: 2rem;
  }
  section#conditions {
    border-color: #ea9a96;
    border-style: solid;
    border-radius: 2em;
  }
  ul.ok li {
    list-style: none;
  }
  li {
    margin-bottom: 1rem;
    text-align: left;
  }

  button,
  a {
    margin-right: 1rem;
    font-size: 1rem;
  }

  button#pay {
    height: 40px;
    font-size: 1rem;
  }
}
</style>
