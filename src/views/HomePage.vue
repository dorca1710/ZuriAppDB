<template>
  <ion-page>
    <ion-content>
      <ion-header>
        <ion-toolbar color="primary">
          <ion-title class="ion-text-center-top">Menú</ion-title>
          <ion-buttons slot="end">
            <ion-button @click="logout"  color="black" class="small-logout-button">
        <ion-icon name="log-out">cerrar sesion</ion-icon>
      </ion-button>
            <ion-chip @click="navigateTo('Perfil')">
              <ion-label style="opacity: 1; color: black;">Hola {{ getUserName() }}</ion-label>
              <ion-avatar>
                <img alt="Silhouette of a person's head" src="https://ionicframework.com/docs/img/demos/avatar.svg" />
              </ion-avatar>
            </ion-chip>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>

      <ion-card class="custom-card">
        <ion-card-content>
          <ion-button @click="navigateTo('CalendarioTA')" shape="round" expand="full" fill="outline" class="custom-button">
            <ion-icon :icon="calendarOutline"></ion-icon>
            <ion-label>Turnos Asignados</ion-label>
          </ion-button>
          <ion-button @click="navigateTo('CalendarioTA')" expand="full" fill="outline" class="go-button">
            Ir
          </ion-button>
        </ion-card-content>
      </ion-card>

      <ion-card class="custom-card">
        <ion-card-content>
          <ion-button @click="navigateTo('Disponibilidad')" shape="round" expand="full" fill="outline" class="custom-button">
            <ion-icon :icon="calendarOutline"></ion-icon>
            <ion-label>Disponibilidad</ion-label>
          </ion-button>
          <ion-button @click="navigateTo('Disponibilidad')" expand="full" fill="outline" class="go-button">
            Ir
          </ion-button>
        </ion-card-content>
      </ion-card>

      <!-- Botón más pequeño y a un lado -->
      
    </ion-content>
  </ion-page>
</template>


<script>
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonMenuButton, IonButtons, IonCard, IonCardContent, IonButton, IonIcon, IonLabel } from '@ionic/vue';
import { calendarOutline, logOutOutline, personOutline, documentTextOutline } from 'ionicons/icons';


export default {
  name: 'HomePage',
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonMenuButton,
    IonButtons,
    IonCard,
    IonCardContent,
    IonButton,
    IonIcon,
    IonLabel,
  },
  data() {
    return {
      calendarOutline,
      personOutline,
      logOutOutline
     
    };
  },
  methods: {
    navigateTo(page) {
      if (page === 'Perfil') {
        this.$router.push('/api/zuriapp1/perfil');
      } else if (page === 'CalendarioTA') {
        this.$router.push('/api/zuriapp1/calendariota');
      } else if (page === 'Disponibilidad') {
        this.$router.push('/api/zuriapp1/disponibilidad');
      }
    },
    logout() {
      
      this.$router.push('/api/zuriapp1/Login');
    },
    async fetchEvents() {
      try {
        const user = app.currentUser; 
        const mongodb = user.mongoClient('mongodb-atlas');
        const collection = mongodb.db('ZuriAppDB').collection('UsuariosTurnos');
    
        // Se Modifica la consulta para que solo devuelva los documentos que corresponden al usuario que ha iniciado sesión
        const data = await collection.find({ userID: user.id });
        this.turnos = data;
      } catch (error) {
        console.error('Error al recuperar los turnos', error);
      }
    },
    
    getUserName() {
      return localStorage.getItem('userNombre') || 'Usuario';
    },
    // Método para bloquear el botón de retroceso
    blockBackButton() {
      window.history.pushState(null, document.title, window.location.href);
      window.addEventListener('popstate', function (event) {
        window.history.pushState(null, document.title, window.location.href);
      });
    },
  
  },
  
  mounted() {
    this.fetchEvents();
    this.blockBackButton();
  },
};
</script>
<style >
.custom-card {
  width: 80%; 
  margin: 20px auto;

}



.custom-button {
  margin-bottom: 10px;
}

.go-button {
  width: 50%; 
  margin: 0 auto;
}

.small-logout-button {
  font-size: smaller; 
  margin-top: 5px; 
}

</style>