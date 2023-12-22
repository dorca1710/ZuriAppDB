<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button default-href="/api/zuriapp1/home"></ion-back-button>
        </ion-buttons>

        <ion-title class="ion-text-center">Mi Perfil</ion-title>

        <ion-buttons slot="end">
          <ion-button @click="navigateTo('Home')">
            <ion-icon name="home-outline"></ion-icon>
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

    <ion-content class="ion-padding" style="height: 100vh;">
      <ion-card class="custom-card">
        <ion-list>
          <!-- Sección de Información del Usuario -->
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
            <ion-label color="primary">Fecha de Nacimiento: {{ getUserFechaNac() }}</ion-label>
          </ion-item>

          <ion-item>
            <ion-label color="primary">Dirección: {{ getUserDireccion() }} </ion-label>
            
          </ion-item>

          <ion-item>
            <ion-label color="primary">Teléfono:     {{ getUserTelefono() }}</ion-label>
            
          </ion-item>

          <ion-item>
            <ion-label color="primary">Email: {{ getUserEmail() }}</ion-label>
          </ion-item>

          <ion-item>
            <ion-label color="primary">Ciudad: {{ getUserCiudad() }}</ion-label>
          </ion-item>

          <ion-item>
            <ion-label color="primary">Habilitado: {{ getUserHabilitado() }}</ion-label>
          </ion-item>

          <ion-item>
            <ion-label color="primary">Tipo de Cargo: {{ getUserTipoCargo() }}</ion-label>
          </ion-item>
        </ion-list>

       
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script>
import { ref, onMounted, } from 'vue';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonBackButton,
  IonContent,
  IonItem,
  IonLabel,
  IonButton,
  IonList,
  IonCard,
  IonInput,
  IonIcon,
  IonChip,
} from '@ionic/vue';
import * as Realm from 'realm-web';
import { createOutline, checkmarkOutline } from 'ionicons/icons';
import { useRouter } from 'vue-router';

export default {
  name: 'UserProfile',
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonItem,
    IonLabel,
    IonButton,
    IonList,
    IonCard,
    IonBackButton,
    IonInput,
    IonIcon,
    IonChip,
  },
  setup() {
    const router = useRouter();
    const editingDireccion = ref(false);
    const direccion = ref('');
    const editedDireccion = '';
    const editedTelefono = '';
    const editingTelefono = ref(false);
    const telefono = ref('');

    const app = Realm.getApp('zuridbnew-rkxju');

    const startEditing = (field) => {
      if (field === 'direccion') {
        editingDireccion.value = true;
        editedDireccion.value = direccion.value;
      } else if (field === 'telefono') {
        editingTelefono.value = true;
        editedTelefono.value = telefono.value;
      }
    };

    const saveAvailability = async () => {
      try {
        const user = await app.currentUser;
        const mongodb = user.mongoClient('mongodb-atlas');

        // Acceso a la colección 'Usuario'
        const collectionUsuario = mongodb.db('ZuriAppDB').collection('Usuario');

        // Filtro para identificar el documento del usuario actual
        const filter = { userID: user.id };

        // Actualiza solo los campos necesarios según los datos ingresados por el usuario
        const updateData = {
          $set: {
            direccion: direccion.value,
            telefono: telefono.value,
          },
        };

        // Actualiza el documento del usuario actual en la colección 'Usuario'
        await collectionUsuario.findOneAndUpdate(filter, updateData);

        
        // Actualiza los valores locales después de guardar los cambios
        getUserDireccion();
        getUserTelefono();

        // Mensaje de éxito
        alert('¡Datos guardados exitosamente !');

        // Redirige a la página deseada
        router.replace('/api/zuriapp1/home');
      } catch (error) {
        console.error('Error al guardar datos', error);
        // Almacena el error para mostrarlo en el template
        error.value = {
          errorCode: error.errorCode || '',
          error: error.message || 'Error al guardar datos',
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

    onMounted(async () => {
      try {
        // Find the document of the current user
        const userData = await collectionUsuario.findOne({ userID: user.id });

        // Update the user's information
        if (userData) {
          // Assuming 'user' is an object that holds the user's data
          user.name = userData.name;
          user.rut = userData.rut;
          user.email = userData.email;
          user.apellido = userData.apellido;
          user.fecha_nac = userData.fecha_nac;
          user.direccion = userData.direccion;
          user.telefono = userData.telefono;
          user.ciudad = userData.ciudad;
          user.habilitado = userData.habilitado;
          user.tipo_cargo = userData.tipo_cargo;

          // Store the user's information in localStorage for later use
          localStorage.setItem('userNombre', user.name);
          localStorage.setItem('userRut', user.rut);
          localStorage.setItem('userEmail', user.email);
          localStorage.setItem('userApellido', user.apellido);
          localStorage.setItem('userFechaNac', user.fecha_nac);
          localStorage.setItem('userDireccion', user.direccion);
          localStorage.setItem('userTelefono', user.telefono);
          localStorage.setItem('userCiudad', user.ciudad);
          localStorage.setItem('userHabilitado', user.habilitado);
          localStorage.setItem('userTipoCargo', user.tipo_cargo);
          
          // Actualiza los valores locales después de obtener datos del usuario
          userDireccion.value = user.direccion;
          userTelefono.value = user.telefono;
        
          // Obtén los valores actualizados de los campos de dirección y teléfono
          const updatedDireccion = computed(() => userDireccion.value);
          const updatedTelefono = computed(() => userTelefono.value); 
        }
      } catch (error) {
        console.error('Error al obtener datos del usuario', error);
      }
    });

    return {
      getUserName,
      saveChanges: () => {}, 
      getUserApellido,
      getUserRut,
      getUserEmail,
      getUserFechaNac,
      getUserCiudad,
      getUserDireccion,
      getUserHabilitado,
      getUserTipoCargo,
      getUserTelefono,
      startEditing,
      editingDireccion,
      editingTelefono,
      router,
      direccion,
      telefono,
      checkmarkOutline,
      createOutline,
      saveAvailability,
    };
  },
};
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

ion-input {
  color: black;
}

ion-item {
  --ion-text-color: black;
}
</style>