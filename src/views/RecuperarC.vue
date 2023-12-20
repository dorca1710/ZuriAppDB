<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title class="ion-text-center">Recuperar Contraseña</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-grid>
        <ion-row class="ion-justify-content-center">
          <ion-col size-lg="6" size-md="8" size-xs="12">
            <div class="ion-text-center ion-padding">
              <img src="/logozuriapp.png" alt="Zuri" />
            </div>

            <ion-card  class="custom-card ion-padding">
              <ion-card-content>
                <ion-list>
                  <ion-item>
                    <ion-label position="stacked" color="primary">Email</ion-label>
                    <ion-input v-model="email"></ion-input>
                  </ion-item>
                </ion-list>

                <ion-button @click="recoverPassword" expand="full" shape="round" color="primary" class="ion-margin-top">Recuperar Contraseña</ion-button>

                <ion-button @click="goToLogin" expand="full" shape="round" color="primary">
                  Volver al Inicio de Sesión
                </ion-button>
              </ion-card-content>
            </ion-card>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      authToken: 'tu-token-de-autenticacion', 
    };
  },
  methods: {
    async recoverPassword() {
  console.log(this.email); 
  if (!this.email) {
    return console.error('El email es requerido');
  }

  try {
    const response = await fetch('http://localhost:8100/api/zuriapp1/recuperarc', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.authToken,
      },
      body: JSON.stringify({ email: this.email }),
    });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);

        if (data.success) {
          console.log('Solicitud de recuperación de contraseña exitosa. Token:', data.token);
        } else {
          console.error('Error al recuperar contraseña:', data.error);
        }
      } catch (error) {
        console.error('Error al recuperar contraseña:', error);
      }
    },
    goToLogin() {
      this.$router.push('/api/zuriapp1/Login');
    },
  },
};
</script>

<style scoped>
  .ion-padding {
    --padding-top: 20px;
    --padding-bottom: 20px;
  }

  ion-card {
    border-radius: 20px;
    box-shadow: 0 4px 6px 0 rgba(0, 0, 0, 0.2);
  }

  ion-content {
    --background: #FFB266;
  }
</style>