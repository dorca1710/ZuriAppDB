<template>
    <ion-page>
      <ion-header>
        <ion-toolbar color="primary">
            <ion-buttons side="start">
    <ion-back-button default-href="#"></ion-back-button>
  </ion-buttons>
          <ion-title class="ion-text-center">Asignacion de Turnos</ion-title>
        </ion-toolbar>
      </ion-header>
  
      <ion-content>
        <ion-grid class="ion-padding">
          <ion-row>
            <ion-col>
              <ion-item>
                <ion-label position="stacked" color="primary">Rut Saliente</ion-label>
                <ion-input v-model="rutsaliente" type="text" autocomplete="new_password"></ion-input>
              </ion-item>
            </ion-col>
          </ion-row>
  
          <ion-row>
            <ion-col>
              <ion-item>
                <ion-label position="stacked" color="primary">Nombre Saliente</ion-label>
                <ion-input v-model="nombresaliente" type="text" autocomplete="new_password"></ion-input>
              </ion-item>
            </ion-col>
          </ion-row>
          <ion-row>
            <ion-col>
              <ion-item>
                <ion-label position="stacked" color="primary">Apellido Saliente</ion-label>
                <ion-input v-model="apellidosaliente" type="text" autocomplete="new_password"></ion-input>
              </ion-item>
            </ion-col>
          </ion-row>
          <ion-row>
            <ion-col>
              <ion-item>
                <ion-label position="stacked" color="primary">Rut Entrante</ion-label>
                <ion-input v-model="rutentrante" type="text" autocomplete="new_password"></ion-input>
              </ion-item>
            </ion-col>
          </ion-row>
          <ion-row>
            <ion-col>
              <ion-item>
                <ion-label position="stacked" color="primary">Nombre Entrante</ion-label>
                <ion-input v-model="nombreentrante" type="text" autocomplete="new_password"></ion-input>
              </ion-item>
            </ion-col>
          </ion-row>
          <ion-row>
            <ion-col>
              <ion-item>
                <ion-label position="stacked" color="primary">Apellido Entrante</ion-label>
                <ion-input v-model="apellidoentrante" type="text" autocomplete="new_password"></ion-input>
              </ion-item>
            </ion-col>
          </ion-row>
          <ion-row>
            <ion-col>
              <ion-item>
                <ion-label position="stacked" color="primary">Tipo turno</ion-label>
                <ion-input v-model="tipoturno" type="text" autocomplete="new_password"></ion-input>
              </ion-item>
            </ion-col>
          </ion-row>
          <ion-row>
            <ion-col>
              <ion-item>
                <ion-label position="stacked" color="primary">Fecha inicio turno de reemplazo</ion-label>
                <ion-input v-model="fechainicioreemplazo" type="date" autocomplete="new_password"></ion-input>
              </ion-item>
            </ion-col>
          </ion-row>
  
          <ion-row>
            <ion-col>
              <ion-item>
                <ion-label position="stacked" color="primary">Fecha termino turno de reemplazo</ion-label>
                <ion-input v-model="fechaterminoreemplazo" type="date" autocomplete="new_password"></ion-input>
              </ion-item>
            </ion-col>
          </ion-row>
          <ion-row>
            <ion-col>
              <ion-item>
                <ion-label position="stacked" color="primary">Email</ion-label>
                <ion-input v-model="email" type="text" autocomplete="new_password"></ion-input>
              </ion-item>
            </ion-col>
          </ion-row>
  
          <ion-row>
            <ion-col>
              <ion-item>
                <ion-label position="stacked" color="primary">Password</ion-label>
                <ion-input v-model="password" type="password" autocomplete="new_password"></ion-input>
              </ion-item>
            </ion-col>
          </ion-row>
       
        <ion-row>
            <ion-col>
              <ion-item>
                <ion-label position="stacked" color="primary">Servicio</ion-label>
                <ion-input v-model="servicio" type="text" autocomplete="new_password"></ion-input>
              </ion-item>
            </ion-col>
          </ion-row>
       

        
        <div class="ion-padding">
        <ion-button @click="saveAvailability" expand="full" shape="round" color="primary">
          Guardar Turno Asignado
        </ion-button>
      </div>
     </ion-grid>
      <p v-if="error" class="ion-margin-top">{{ error.errorCode }} {{ error.error }}</p>
    </ion-content>
  </ion-page>
</template>
  
  
<script>
import { IonInput, IonItem, IonGrid, IonRow, IonCol, IonButton } from '@ionic/vue';
import { defineComponent, ref } from 'vue';
import * as Realm from 'realm-web';
import { useRouter } from 'vue-router';
import moment from 'moment';

const app = new Realm.App({ id: 'zuridbnew-rkxju' });

export default defineComponent({
  name: 'AsignaciondeTurnos',
  components: { IonInput, IonItem, IonGrid, IonRow, IonCol, IonButton },
  setup() {
    const rutsaliente = ref('');
    const nombresaliente = ref('');
    const apellidosaliente = ref('');
    const rutentrante = ref('');
    const nombreentrante = ref('');
    const apellidoentrante = ref('');
    const tipoturno = ref('');
    const fechainicioreemplazo = ref('');
    const fechaterminoreemplazo = ref('');
    const servicio = ref('');
    const email = ref('');
    const password = ref('');

    const router = useRouter();

    // Configuramos la fecha mínima permitida
    const minDate = new Date().toISOString();

    const saveAvailability = async () => {
      try {
        const credentials = Realm.Credentials.emailPassword(email.value, password.value);
        const user = await app.logIn(credentials);

        const mongodb = user.mongoClient('mongodb-atlas');
        const collection = mongodb.db('ZuriAppDB').collection('Reemp');

        const availabilityData = {
          rutsaliente: rutsaliente.value || '',
          nombresaliente: nombresaliente.value || '',
          apellidosaliente: apellidosaliente.value || '',
          rutentrante: rutentrante.value || '',
          nombreentrante: nombreentrante.value || '',
          apellidoentrante: apellidoentrante.value || '',
          tipoturno: tipoturno.value || '',
          fechainicioreemplazo: moment(fechainicioreemplazo.value).format('YYYY-MM-DD'),
          fechaterminoreemplazo: moment(fechaterminoreemplazo.value).format('YYYY-MM-DD'),
          servicio: servicio.value || '',
          email: email.value,
          password: password.value || '',
        };

        const existingAvailabilities =
          JSON.parse(localStorage.getItem('availabilities')) || [];

        existingAvailabilities.push(availabilityData);

        localStorage.setItem('availabilities', JSON.stringify(existingAvailabilities));

        // Guarda el nombre saliente en localStorage
        localStorage.setItem('userRutSaliente', rutsaliente.value);
        localStorage.setItem('userNombreSaliente', nombresaliente.value);
        localStorage.setItem('userApellidoSaliente', apellidosaliente.value);
        localStorage.setItem('userRutEntrante', rutentrante.value);
        localStorage.setItem('userNombreEntrante', nombreentrante.value);
        localStorage.setItem('userApellidoEntrante', apellidoentrante.value);
        localStorage.setItem('userTipoTurno', tipoturno.value);
        localStorage.setItem('userFechaInicioReemplazo', fechainicioreemplazo.value);
        localStorage.setItem('userFechaTerminoReemplazo', fechaterminoreemplazo.value);
        localStorage.setItem('userServicio', servicio.value);
      

        // Autenticar el usuario
        await app.logIn(Realm.Credentials.emailPassword(email.value, password.value));

        

        await collection.insertMany([
          {
            userID: app.currentUser.id,
            rutsaliente: availabilityData.rutsaliente,
            nombresaliente: availabilityData.nombresaliente,
            apellidosaliente: availabilityData.apellidosaliente,
            rutentrante: availabilityData.rutentrante,
            nombreentrante: availabilityData.nombreentrante,
            apellidoentrante: availabilityData.apellidoentrante,
            tipoturno: availabilityData.tipoturno,
            fechainicioreemplazo: availabilityData.fechainicioreemplazo,
            fechaterminoreemplazo: availabilityData.fechaterminoreemplazo,
            servicio: availabilityData.servicio,
            email: availabilityData.email,
            password: availabilityData.password,
          },
        ]);
      } catch (error) {
        console.error('Error al guardar turnos asignados', error);
      }
    };

    const getUserRutSaliente = () => {
      return localStorage.getItem('userRutSaliente') || 'rutsaliente';
    };

    const getUserNombreSaliente = () => {
      return localStorage.getItem('userNombreSaliente') || 'nombresaliente';
    };

    const getUserApellidoSaliente = () => {
      return localStorage.getItem('userApellidoSaliente') || 'apellidosaliente';
    };

    const getUserRutEntrante = () => {
      return localStorage.getItem('userRutSaliente') || 'rutsaliente';
    };

    const getUserNombreEntrante = () => {
      return localStorage.getItem('userNombreEntrante') || 'nombreentrante';
    };

    const getUserApellidoEntrante = () => {
      return localStorage.getItem('userApellidoEntrante') || 'apellidoentrante';
    };

    const getUserTipoTurno = () => {
      return localStorage.getItem('userTipoTurno') || 'tipoturno';
    };

    const getUserFechaInicioReemplazo = () => {
      return localStorage.getItem('userFechaInicioReemplazo') || 'fechainicioreemplazo';
    };

    const getUserFechaTerminoReemplazo = () => {
      return localStorage.getItem('userFechaTerminoReemplazo') || 'fechaterminoreemplazo';
    };

    const getUserServicio = () => {
      return localStorage.getItem('userServicio') || 'servicio';
    };

    


    return {
      fechainicioreemplazo,
      fechaterminoreemplazo,
      rutsaliente,
      nombresaliente,
      apellidosaliente,
      rutentrante,
      nombreentrante,
      apellidoentrante,
      tipoturno,
      servicio,
      email,
      password,
      minDate,
      saveAvailability,
      getUserRutSaliente,
      getUserNombreSaliente,
      getUserApellidoSaliente,
      getUserRutEntrante,
      getUserNombreEntrante,
      getUserApellidoEntrante,
      getUserFechaInicioReemplazo,
      getUserFechaTerminoReemplazo,
      getUserTipoTurno,
      getUserServicio
    };
  },
});
</script>

<style scoped>

ion-content {
  --background: #ffb266;
}

.ion-padding {
  padding: 16px;
}
</style>