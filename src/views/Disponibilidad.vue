<template>
  <ion-page>
    <ion-header>
  <ion-toolbar color="primary">
    <ion-buttons side="start">
      <ion-back-button default-href="/api/zuriapp1/home"></ion-back-button>
    </ion-buttons>

    <ion-title class="ion-text-center-top">Mi Disponibilidad</ion-title>

    <ion-buttons slot="end">
      <ion-chip @click="navigateTo('Perfil')">
        <ion-label style="opacity: 1; color: black;">Hola {{ getUserName() }}</ion-label>
        <ion-avatar>
          <img alt="Silhouette of a person's head" src="https://ionicframework.com/docs/img/demos/avatar.svg" />
        </ion-avatar>
      </ion-chip>
    </ion-buttons>
  </ion-toolbar>
</ion-header>

    

    <ion-content>
      <ion-card class="custom-card ion-padding" >
        <!-- Datos de Usuario -->
        

        <ion-item>
          <ion-label color="primary">Rut: {{ getUserRut() }}</ion-label>
        </ion-item>

        <ion-item>
          <ion-label color="primary">Nombre: {{ getUserName() }}</ion-label>
        </ion-item>

        <ion-item>
          <ion-label color="primary">Apellido: {{ getUserApellido() }}</ion-label>
        </ion-item>

        <ion-item>
          <ion-label color="primary">Teléfono: {{ getUserTelefono() }}</ion-label>
        </ion-item>

        <ion-item>
          <ion-label color="primary">Email: {{ getUserEmail() }}</ion-label>
        </ion-item>

        
      </ion-card>

      <ion-card class="custom-card ion-padding">
        <!-- Formulario de Disponibilidad -->
        <ion-item v-for="(date, index) in fechaDisponible" :key="index">
          <ion-label position="stacked" color="primary">Fecha Disponible</ion-label>
          <ion-input v-model="fechaDisponible[index]" type="date" autocomplete="new_password"></ion-input>
        </ion-item>
        <ion-icon name="remove-circle"></ion-icon>

        <ion-button @click="agregarFecha" expand="full" shape="round" color="primary" class="ion-margin-top">Agregar Fecha</ion-button>
      </ion-card>
      <ion-card class="custom-card ion-padding">
        <ion-item>
          <ion-label position="stacked" color="primary">Descripción</ion-label>
          <ion-textarea v-model="descripcion" placeholder="Agrega una descripción"></ion-textarea>
        </ion-item>
      </ion-card>

      <!-- Botón para Guardar Disponibilidad -->
      <div style="padding-top: 6px;">
        <ion-button @click="saveAvailability" expand="full" shape="round" color="primary" class="ion-margin-top">Guardar Disponibilidad</ion-button>
      </div>

      <p v-if="error">{{ error.errorCode }} {{ error.error }}</p>
      <p v-if="successMessage" style="color: green;">{{ successMessage }}</p>
    </ion-content>
  
  </ion-page>
</template>

<script>
import { ref, onMounted, defineComponent } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonBackButton, IonContent, IonItem, IonLabel, IonButton, IonCard, IonInput, IonTextarea, IonIcon } from '@ionic/vue';
import * as Realm from 'realm-web';
import { eye,  } from 'ionicons/icons';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'disponibilidad',
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonItem,
    IonLabel,
    IonButton,
    IonBackButton,
    IonCard,
    IonInput,
    IonTextarea,
    IonIcon,
    
  },
  setup() {
    const rut = ref("");
    const nombre = ref("");
    const telefono = ref("");
    const email = ref("");
    const fechaDisponible = ref([""]);
    const descripcion = ref("");
    const eyeIcon = ref(eye);

    const successMessage = ref("");
    const error = ref(null);

    const userData = ref({});

    const router = useRouter();

    const app = Realm.getApp('zuridbnew-rkxju');

    const fetchUserData = async () => {
      try {
        const user = await app.currentUser;
        const mongodb = user.mongoClient('mongodb-atlas');
        const collection = mongodb.db('ZuriAppDB').collection('Usuario');
        const userDoc = await collection.findOne({ userID: user.id });

        Object.assign(userData.value, userDoc);
      } catch (error) {
        console.error('Error al recuperar los datos del usuario', error);
      }
    };

    

    const agregarFecha = () => {
      fechaDisponible.value.push(""); 
    };
  
    const saveAvailability = async () => {
  try {
    const user = await app.currentUser;
    const mongodb = user.mongoClient('mongodb-atlas');

    // Acceso a la colección 'Usuario'
    const collectionUsuario = mongodb.db('ZuriAppDB').collection('Usuario');

    // Validación que se haya seleccionado al menos una fecha
    if (!fechaDisponible.value.some((fecha) => fecha !== "")) {
      alert('¡Por favor selecciona al menos una fecha disponible!');
      return;
    }

    // Filtro para identificar el documento del usuario actual
    const filter = { userID: user.id };

    // Actualiza solo los campos necesarios según los datos ingresados por el usuario
    const updateData = {
      $set: {
        fechaDisponible: fechaDisponible.value,
        descripcion: descripcion.value,
      },
    };

    // Actualiza el documento del usuario actual en la colección 'Usuario'
    await collectionUsuario.updateOne(filter, updateData);

    // Mensaje de éxito
    alert('¡Fechas disponibles guardadas exitosamente en la colección Usuario!');

    // Redirige a la página deseada
    router.replace("/api/zuriapp1/home");
  } catch (error) {
    console.error("Error al guardar datos de disponibilidad", error);
    // Almacena el error para mostrarlo en el template
    error.value = {
      errorCode: error.errorCode || "",
      error: error.message || "Error al guardar datos de disponibilidad"
    };
  }
};

    const getUserName = () => {
      return localStorage.getItem('userNombre') || 'Usuario';
    };
    const getUserRut = () => {
      return localStorage.getItem('userRut') || 'Usuario';
    };

    const getUserEmail = () => {
      return localStorage.getItem('userEmail') || 'Usuario';
    };

    const getUserApellido = () => {
      return localStorage.getItem('userApellido') || 'Usuario';
    };

    const getUserFechaNac = () => {
      return localStorage.getItem('userFechaNac') || 'Usuario';
    };

    const getUserDireccion = () => {
      return localStorage.getItem('userDireccion') || 'Usuario';
    };

    const getUserTelefono = () => {
      return localStorage.getItem('userTelefono') || 'Usuario';
    };

    const getUserCiudad = () => {
      return localStorage.getItem('userCiudad') || 'Usuario';
    };

    const getUserHabilitado = () => {
      return localStorage.getItem('userHabilitado') || 'Usuario';
    };

    const getUserTipoCargo = () => {
      return localStorage.getItem('userTipoCargo') || 'Usuario';
    };

    const blockBackButton = () => {
      window.history.pushState(null, document.title, window.location.href);
      window.addEventListener('popstate', function (event) {
        window.history.pushState(null, document.title, window.location.href);
      });
    };

    onMounted(() => {
      fetchUserData();
      blockBackButton(); 
    });

    return {
      saveAvailability,
      userData,
      agregarFecha,
      fechaDisponible,
      descripcion,
      successMessage,
      error,
      getUserName,
      getUserApellido,
      getUserRut,
      getUserEmail,
      getUserFechaNac,
      getUserCiudad,
      getUserDireccion,
      getUserHabilitado,
      getUserTipoCargo,
      getUserTelefono,
      
    };
  },
});



</script>

<style>
.custom-card {
  border: 2px solid var(--ion-color-primary);
  border-radius: 15px;
  padding: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}

ion-label {
  color: var(--ion-color-primary);
}

ion-input,
ion-textarea {
  color: black;
}

ion-item {
  --ion-text-color: black;
}

ion-content {
  --background: #ffb266;
}

.custom-card {
  border: 2px solid var(--ion-color-primary);
  border-radius: 15px;
  padding: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}

.ion-padding {
  padding: 16px;
}
</style>