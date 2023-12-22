<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title class="ion-text-center">Inicio de Sesión</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-grid>
        <ion-row class="ion-justify-content-center">
          <ion-col size-lg="6" size-md="8" size-xs="12">
            <div class="ion-text-center ion-padding">
              <img src="/logozuriapp.png" alt="Zuri" />
            </div>

          
              <ion-card   class="custom-card ion-padding">
                <ion-list>
                  <ion-item>
                    <ion-label position="stacked" color="primary">Email</ion-label>
                    <ion-input v-model="email" type="text" autocomplete="new_password"></ion-input>
                  </ion-item>

                  <ion-item class="input-icon">
  <ion-label position="stacked" color="primary">Contraseña</ion-label>
  <ion-input v-model="password" :type="passwordText" autocomplete="new_password"></ion-input>
  <ion-icon :icon="eye" @click="passwordType" slot="end"></ion-icon>
</ion-item>
                  
                </ion-list>
                <div style="padding-top: 6px;">
                  <ion-button @click="loginEmailPassword" expand="full" shape="round" color="primary" class="ion-margin-top">Iniciar sesión</ion-button>
                </div>
               
 
  <ion-toast :isOpen="showToast" :message="toastMessage" :duration="toastDuration" position="middle"></ion-toast>
              
            </ion-card>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
    
  </ion-page>
</template>

<script>
import { ref, onMounted} from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonCard, IonCardContent, IonList, IonItem, IonLabel, IonInput, IonIcon, IonButton, IonToast } from '@ionic/vue';
import * as Realm from "realm-web";
import { eye, eyeOff } from 'ionicons/icons';
import { useRouter } from 'vue-router';



export default {
  name: 'Login',
  components: {
    IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonCard, IonCardContent, IonList, IonItem, IonLabel, IonInput, IonIcon, IonButton, IonToast
  },
  setup() {
    const email = ref("");
    const password = ref("");
    const nombre = ref("");
    const apellido = ref("");
    const rut = ref("");
    const fechaNac = ref("");
    const direccion = ref("");
    const telefono = ref("");
    const ciudad = ref("");
    const habilitado = ref("");
    const tipoCargo = "";
    const error = ref("");
    const eyeIcon = ref(eye);
    const passwordText = ref('password');
    const router = useRouter();

    // Agregado: ion-toast
    const showToast = ref(false);
    const toastMessage = ref('');
    const toastDuration = ref(2000);

    const app = Realm.getApp("zuridbnew-rkxju");

    const realmConfig = {
      sync: {
        user: app.currentUser,
        partitionValue: app.currentUser,
        fullSynchronization: true,
      },
    };

    const passwordType = () => {
      passwordText.value = passwordText.value === 'password' ? 'text' : 'password';
      eyeIcon.value = passwordText.value === 'password' ? eye : eyeOff;
    };

    const presentToast = (message) => {
      showToast.value = true;
      toastMessage.value = message;
      setTimeout(() => {
        showToast.value = false;
      }, toastDuration.value);
    };


  ;
    const loginEmailPassword = async () => {
  const credentials = Realm.Credentials.emailPassword(email.value, password.value);
  try {
    const user = await app.logIn(credentials);

        if (user) {
          const mongodb = user.mongoClient("mongodb-atlas");
          const collection = mongodb.db("ZuriAppDB").collection("Usuario");
          const userProfile = await collection.findOne({ userID: user.id });

          if (userProfile && userProfile.nombre && userProfile.apellido) {
            localStorage.setItem('userId', user.id);
            localStorage.setItem('userEmail', userProfile.email);
            localStorage.setItem('userNombre', `${userProfile.nombre} `);
            localStorage.setItem('userRut', `${userProfile.rut}`);
            localStorage.setItem('userApellido', `${userProfile.apellido} `);
            localStorage.setItem('userFechaNac', `${userProfile.fechaNac}`);
            localStorage.setItem('userDireccion', `${userProfile.direccion}`);
            localStorage.setItem('userTelefono', `${userProfile.telefono}`);
            localStorage.setItem('userCiudad', `${userProfile.ciudad}`);
            localStorage.setItem('userHabilitado', `${userProfile.habilitado}`);
            localStorage.setItem('userTipoCargo', `${userProfile.tipoCargo}`);

            // Muestra el ion-toast después de un registro exitoso
            presentToast(`Bienvenido ${user.id}`);
          } else {
            alert('¡Porfavor ingrese las credenciales correctas!');
    return;
          }
        }

        router.push("/api/zuriapp1/home");
      } catch (err) {
        console.error("Error al iniciar sesión:", err);
        alert('Error al iniciar sesión');
      }
    };

  
    const initializeRealm = async () => {
      try {
        const realm = await Realm.open(realmConfig);

        realm.addListener('change', () => {
          console.log('Cambios en el Realm local');
        });
      } catch (error) {
        console.error('Error al inicializar Realm:', error);
      }
    };

    const connectivityChangeListener = (event) => {
      const isOnline = navigator.onLine;

      if (isOnline) {
        // Si hay conexión, intenta sincronizar cambios
        realm.syncSession.uploadAllLocalChanges().catch((error) => {
          console.error('Error durante la sincronización:', error);
        });
      }
    };

    onMounted(() => {
      initializeRealm();
      window.addEventListener('online', connectivityChangeListener);
      window.addEventListener('offline', connectivityChangeListener);
    });
    

    return {
      email,
      password,
      nombre,
      apellido,
      rut,
      fechaNac,
      direccion,
      telefono,
      ciudad,
      habilitado,
      tipoCargo,
      error,
      showToast,
      toastMessage,
      toastDuration,
      eye: eyeIcon,
      passwordType,
      passwordText,
      loginEmailPassword,
    };
  },

  goTorecuperarc() {
      this.$router.push('/api/zuriapp1/recuperarc');
    },

    

  data() {
    return {
      showToast: false,
      toastMessage: '',
      toastDuration: 2000,
    };
  },
};
</script>

<style>

.toast-container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 9999;
  padding: 10px;
  background-color: #333;
  color: #fff;
  border-radius: 5px;
  text-align: center;
}


</style>

