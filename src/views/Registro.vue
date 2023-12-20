<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title class="ion-text-center">Registro</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-grid>
        <ion-row class="ion-justify-content-center">
          <ion-col size-lg="6" size-md="8" size-xs="12">
            <div class="ion-text-center ion-padding">
              <img src="/logozuriapp.png" alt="Zuri" />
            </div>

            <ion-card>
              <ion-card-content>
                <ion-list>
                  <ion-item>
                    <ion-label position="stacked" color="primary">Nombre</ion-label>
                    <ion-input v-model="nombre" type="text" autocomplete="new_password"></ion-input>
                  </ion-item>
                  <ion-item>
                    <ion-label position="stacked" color="primary">Apellido</ion-label>
                    <ion-input v-model="apellido" type="text" autocomplete="new_password"></ion-input>
                  </ion-item>
                  <ion-item>
                    <ion-label position="stacked" color="primary">Email</ion-label>
                    <ion-input v-model="email" type="text" autocomplete="new_password"></ion-input>
                  </ion-item>

                  <ion-item class="input-icon">
                    <ion-label position="stacked" color="primary">Contraseña</ion-label>
                    <ion-input v-model="password" :type="passwordText" autocomplete="new_password"></ion-input>
                    <ion-icon :icon="eye" @click="passwordType"></ion-icon>
                  </ion-item>

                  <ion-item class="input-icon">
                    <ion-label position="stacked" color="primary">Repetir Contraseña</ion-label>
                    <ion-input v-model="repeatPassword" type="password" autocomplete="new_password"></ion-input>
                  </ion-item>

                  <!-- Nuevos campos -->
                  <ion-item>
                    <ion-label position="stacked" color="primary">Rut</ion-label>
                    <ion-input v-model="rut" type="text" autocomplete="new_password"></ion-input>
                  </ion-item>
                  <ion-item>
                    <ion-label position="stacked" color="primary">Fecha de Nacimiento</ion-label>
                    <ion-input v-model="fechaNac" type="date" autocomplete="new_password"></ion-input>
                  </ion-item>
                  <ion-item>
                    <ion-label position="stacked" color="primary">Dirección</ion-label>
                    <ion-input v-model="direccion" type="text" autocomplete="new_password"></ion-input>
                  </ion-item>
                  <ion-item>
                    <ion-label position="stacked" color="primary">Teléfono</ion-label>
                    <ion-input v-model="telefono" type="tel" autocomplete="new_password"></ion-input>
                  </ion-item>
                  <ion-item>
                    <ion-label position="stacked" color="primary">Ciudad</ion-label>
                    <ion-input v-model="ciudad" type="text" autocomplete="new_password"></ion-input>
                  </ion-item>
                  <ion-item>
                    <ion-label position="stacked" color="primary">Habilitado</ion-label>
                    <ion-input v-model="habilitado" position="stacked" color="primary" autocomplete="new_password"></ion-input>
                  </ion-item>
                  <ion-item>
                    <ion-label position="stacked" color="primary">Tipo de Cargo</ion-label>
                    <ion-input v-model="tipoCargo" type="text" autocomplete="new_password"></ion-input>
                  </ion-item>
                </ion-list>
                <div style="padding-top: 6px;">
                  <ion-button @click="createAccountEmailPassword" expand="full" shape="round" color="primary" class="ion-margin-top">Registrarse</ion-button>
                </div>
                <div padding>
                  <ion-button router-link="/api/zuriapp1/Login" expand="full" shape="round" color="secondary" class="ion-margin-top">Cancelar</ion-button>
                </div>
                <p v-if="error">{{ error.errorCode }} {{ error.error }}</p>
              </ion-card-content>
            </ion-card>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<script>
import { ref } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonCard, IonCardContent, IonList, IonItem, IonLabel, IonInput, IonIcon, IonButton } from '@ionic/vue';
import { eye, eyeOff } from 'ionicons/icons';
import * as Realm from "realm-web";
import { useRouter } from 'vue-router';

export default {
  name: 'Registro',
  components: {
    IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonCard, IonCardContent, IonList, IonItem, IonLabel, IonInput, IonIcon, IonButton
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
    const tipoCargo = ref("");
    const error = ref("");
    const eyeIcon = ref(eye);
    const passwordText = ref('password');
    const repeatPassword = ref("");

    const router = useRouter();

    const app = Realm.getApp("zuridbnew-rkxju");

    const passwordType = () => {
      passwordText.value = passwordText.value === 'password' ? 'text' : 'password';
      eyeIcon.value = passwordText.value === 'password' ? eye : eyeOff;
    };

    const createAccountEmailPassword = async () => {
      try {
        // Validar datos
        if (
          !email.value ||
          !password.value ||
          !nombre.value ||
          !apellido.value ||
          !rut.value ||
          !fechaNac.value ||
          !direccion.value ||
          !telefono.value ||
          !ciudad.value ||
          !habilitado.value ||
          !tipoCargo.value ||
          !repeatPassword.value ||
          password.value !== repeatPassword.value
        ) {
          throw new Error("Por favor, completa todos los campos y asegúrate de que las contraseñas coincidan.");
        }

        // Crear usuario
        await app.emailPasswordAuth.registerUser({
          email: email.value,
          password: password.value,
        });

        // Autenticar el usuario
        await app.logIn(
          Realm.Credentials.emailPassword(email.value, password.value));

        // Guardar información del perfil de nuevo usuario
        const mongodb = app.currentUser.mongoClient("mongodb-atlas");
        const collection = mongodb.db("ZuriAppDB").collection("Usuario");

        // Utiliza insertMany en lugar de insert y pasa un arreglo con un solo documento
        await collection.insertMany([{
          userID: app.currentUser.id,
          email: email.value,
          password: password.value,
          nombre: nombre.value,
          apellido: apellido.value,
          rut: rut.value,
          fechaNac: fechaNac.value,
          direccion: direccion.value,
          telefono: telefono.value,
          ciudad: ciudad.value,
          habilitado: habilitado.value,
          tipoCargo: tipoCargo.value,
        }]);

        // Redirigir solo después de crear el registro
        router.replace("/api/zuriapp1/Login");
      } catch (err) {
        console.error("Error al registrarse", err);
        error.value = err;
      }
    };

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
      eye: eyeIcon,
      passwordType,
      passwordText,
      repeatPassword,
      error,
      createAccountEmailPassword,
    };
  },
};
</script>

<style>
/* ... (estilos restantes) */
</style>