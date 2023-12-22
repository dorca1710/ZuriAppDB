<template>
  <ion-page>
    <ion-content>
      <ion-header>
        <ion-toolbar color="primary">
          <ion-buttons side="start">
            <ion-back-button default-href="/api/zuriapp1/home"></ion-back-button>
          </ion-buttons>

          <ion-title class="ion-text-center-top">Mi Calendario de Turnos Asignados</ion-title>

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

      <!-- FullCalendar dentro de un ion-card para un mejor estilo -->
      <ion-card class="custom-card ion-padding">
        <full-calendar :options="calendarOptions" />
      </ion-card>

      <ion-modal :is-open="isModalOpen" expand="full" shape="round" color="primary">
        <ion-content>
          <ion-card class="custom-card ion-padding">
            <ion-card-header>
              <ion-card-title>Detalles de Turno</ion-card-title>
            </ion-card-header>
            <ion-card-content>
              <!-- Muestra los detalles del día seleccionado -->
              <ion-item>
                <ion-label>Fecha Seleccionada:</ion-label>
                <ion-text>{{ selectedDate }} </ion-text>
              </ion-item>
              <ion-item v-if="selectedEvent">
                <ion-label>Nombre a quien Reemplazo:</ion-label>
                <ion-text>{{ selectedEvent.extendedProps.nombresaliente }}</ion-text>
              </ion-item>
              <ion-item v-if="selectedEvent">
                <ion-label>Apellido a quien Reemplazo:</ion-label>
                <ion-text>{{ selectedEvent.extendedProps.apellidosaliente }}</ion-text>
              </ion-item>
              <ion-item v-if="selectedEvent">
                <ion-label>Fecha Inicio Reemplazo:</ion-label>
                <ion-text>{{ selectedEvent.extendedProps.fechainicioreemplazo }}</ion-text>
              </ion-item>
              <ion-item v-if="selectedEvent">
                <ion-label>Fecha Termino Reemplazo:</ion-label>
                <ion-text>{{ selectedEvent.extendedProps.fechaterminoreemplazo }}</ion-text>
              </ion-item>
              <ion-item v-if="selectedEvent">
                <ion-label>Tipo turno:</ion-label>
                <ion-text>{{ selectedEvent.extendedProps.tipoturno }}</ion-text>
              </ion-item>
              <ion-item v-if="selectedEvent">
                <ion-label>Servicio:</ion-label>
                <ion-text>{{ selectedEvent.extendedProps.servicio }}</ion-text>
              </ion-item>
              <ion-item v-if="selectedEvent">
                <ion-label>Evento:</ion-label>
                <ion-text>{{ selectedEvent.title }}</ion-text>
              </ion-item>
            </ion-card-content>
            <ion-button @click="closeModal">Cerrar</ion-button>
           
          </ion-card>
          
        </ion-content>
      </ion-modal>
      <ion-button @click="exportToPDF" expand="full" shape="round" color="primary" class="ion-margin-top custom-button">
            <ion-icon name="document-text-outline"></ion-icon>
            Exportar PDF
          </ion-button>
    </ion-content>
  </ion-page>
</template>

<script>
import { ref, onMounted } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonGrid, IonBackButton, IonContent, IonButtons, IonCard, IonList, IonItem, IonLabel, IonModal, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonText } from '@ionic/vue';
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { nextTick } from 'vue';
import { documentTextOutline } from 'ionicons/icons';
import esLocale from '@fullcalendar/core/locales/es';
import { jsPDF } from 'jspdf';
import * as Realm from 'realm-web';

const app = new Realm.App({ id: 'zuridbnew-rkxju' });

export default {
  name: 'Calendario',
  components: {
    IonPage,
    IonHeader,
    IonButtons,
    IonToolbar,
    IonTitle,
    IonBackButton,
    IonContent,
    IonCard,
    IonList,
    IonItem,
    IonLabel,
    IonGrid,
    IonModal,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonButton,
    IonText,
    FullCalendar,
  },
  setup() {
    const nombresaliente = ref("");
    const isModalOpen = ref(false);
    const selectedDate = ref('');
    const selectedEvent = ref(null); 
    const events = ref([]);
    const calendar = ref(null);

    const handleDateClick = (arg) => {
      selectedDate.value = arg.dateStr;
      selectedEvent.value = events.value.find(event => 
        new Date(event.start) <= new Date(arg.dateStr) && new Date(arg.dateStr) <= new Date(event.end)
      ); 
      isModalOpen.value = true;
    };

    const closeModal = () => {
      isModalOpen.value = false;
    };

    const fetchEvents = async () => {
      try {
        const user = app.currentUser; 
        const mongodb = user.mongoClient('mongodb-atlas');
        const collection = mongodb.db('ZuriAppDB').collection('Reemp');
    
        // Se Modifica la consulta para que solo devuelva los documentos que corresponden al usuario que ha iniciado sesión
        const data = await collection.find({ userID: user.id }); 

        events.value = data.map(item => {
          // Asegúra de que las fechas de inicio y fin sean objetos Date
          const startDate = new Date(item.fechainicioreemplazo);
          const endDate = new Date(item.fechaterminoreemplazo);

          // Se crea un array para almacenar todos los eventos del turno
          const eventDays = [];

          // Iteracion sobre cada día del turno
          for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
            // Añadir un evento para este día
            eventDays.push({
              title: `Reemplazo `,
              start: new Date(d), 
              end: new Date(d),
              color: 'lightgreen',
              extendedProps: {
                nombresaliente: item.nombresaliente,
                apellidosaliente: item.apellidosaliente,
                fechainicioreemplazo: item.fechainicioreemplazo,
                fechaterminoreemplazo: item.fechaterminoreemplazo,
                tipoturno: item.tipoturno,
                servicio: item.servicio
              }
            });
          }

          // Devuelve el array de eventos del turno
          return eventDays;
        }).flat(); // Aplana el array de arrays en un solo array

        calendarOptions.value = {
          plugins: [dayGridPlugin, interactionPlugin],
          initialView: 'dayGridMonth',
          dateClick: handleDateClick,
          events: events.value
        };
      } catch (error) {
        console.error('Error al recuperar los eventos', error);
      }
    };

    const getUserName = () => {
      return localStorage.getItem('userNombre') || 'Usuario';
    }; 

    const calendarOptions = ref({
      plugins: [dayGridPlugin, interactionPlugin],
      initialView: 'dayGridMonth',
      locales: [esLocale],
      dateClick: handleDateClick,
      events: events.value
    });

    const exportToPDF = async () => {
      await fetchEvents();

      const exportOption = prompt('¿Quieres exportar por día o por mes? Responde con "día" o "mes":');

      if (exportOption.toLowerCase() === 'dia') {
        await chooseSpecificDay();
      } else if (exportOption.toLowerCase() === 'mes') {
        const chosenMonth = prompt('Ingresa el mes específico (AAAA-MM) para exportar el PDF:');
        if (chosenMonth) {
          exportPDFForAllDays(chosenMonth);
        } else {
          alert('No se proporcionó un mes. Exportación de PDF cancelada.');
        }
      } else {
        alert('Opción no válida. Por favor, elige "día" o "mes".');
      }
    };

    const chooseSpecificDay = async () => {
      const chosenDate = prompt('Ingresa la fecha específica (AAAA-MM-DD) para exportar el PDF:');

      if (chosenDate) {
        const isValidDate = events.value.some((event) => {
          return (
            new Date(event.start).toISOString().split('T')[0] === chosenDate ||
            new Date(event.end).toISOString().split('T')[0] === chosenDate
          );
        });

        if (isValidDate) {
          exportPDFForSpecificDate(chosenDate);
        } else {
          alert('Fecha no válida. Por favor, elige una fecha con eventos.');
        }
      } else {
        alert('No se proporcionó una fecha. Exportación de PDF cancelada.');
      }
    };

    const exportPDFForSpecificDate = (chosenDate) => {
      const doc = new jsPDF();

      const eventsForChosenDate = events.value.filter((event) => {
        return (
          new Date(event.start).toISOString().split('T')[0] === chosenDate ||
          new Date(event.end).toISOString().split('T')[0] === chosenDate
        );
      });

      doc.setFontSize(16);
      doc.text('Detalle de Turno', 105, 10, 'center');

      eventsForChosenDate.forEach((event, index) => {
        const yOffset = 20 + index * 80;

        doc.setDrawColor(0);
        doc.setFillColor(255, 255, 255);
        doc.rect(10, yOffset, 190, 70, 'FD');

        doc.setFontSize(12);
        doc.setTextColor(0);
        doc.text('Fecha Seleccionada: ' + event.start, 15, yOffset + 10);
        doc.text('Nombre a quien Reemplazo: ' + event.extendedProps.nombresaliente, 15, yOffset + 20);
        doc.text('Apellido a quien Reemplazo: ' + event.extendedProps.apellidosaliente, 15, yOffset + 30);
        doc.text('Fecha Inicio Reemplazo: ' + event.extendedProps.fechainicioreemplazo, 15, yOffset + 40);
        doc.text('Fecha Termino Reemplazo: ' + event.extendedProps.fechaterminoreemplazo, 15, yOffset + 50);
        doc.text('Tipo turno: ' + event.extendedProps.tipoturno, 15, yOffset + 60);
        doc.text('Servicio: ' + event.extendedProps.servicio, 15, yOffset + 70);
      });

      doc.save('detalle_turno_' + chosenDate + '.pdf');
    };

    const exportPDFForAllDays = (chosenMonth) => {
      const doc = new jsPDF();

      doc.setFontSize(16);
      doc.text('Detalle de Turno', 105, 10, 'center');

      const eventsForChosenMonth = events.value.filter((event) => {
        return (
          new Date(event.start).toISOString().split('T')[0].slice(0, 7) === chosenMonth
        );
      });

      if (eventsForChosenMonth.length === 0) {
        alert('No hay turnos en el mes seleccionado. Exportación de PDF cancelada.');
        return;
      }

      const processedTurnos = {};

      eventsForChosenMonth.forEach((event, index) => {
        if (processedTurnos[event.extendedProps.tipoturno]) {
          return;
        }

        processedTurnos[event.extendedProps.tipoturno] = true;

        const yOffset = 20 + index * 80;

        doc.setDrawColor(0);
        doc.setFillColor(255, 255, 255);
        doc.rect(10, yOffset, 190, 70, 'FD');

        doc.setFontSize(12);
        doc.setTextColor(0);
        doc.text('Fecha Seleccionada: ' + event.start, 15, yOffset + 10);
        doc.text('Nombre a quien Reemplazo: ' + event.extendedProps.nombresaliente, 15, yOffset + 20);
        doc.text('Apellido a quien Reemplazo: ' + event.extendedProps.apellidosaliente, 15, yOffset + 30);
        doc.text('Fecha Inicio Reemplazo: ' + event.extendedProps.fechainicioreemplazo, 15, yOffset + 40);
        doc.text('Fecha Termino Reemplazo: ' + event.extendedProps.fechaterminoreemplazo, 15, yOffset + 50);
        doc.text('Tipo turno: ' + event.extendedProps.tipoturno, 15, yOffset + 60);
        doc.text('Servicio: ' + event.extendedProps.servicio, 15, yOffset + 70);
      });

      doc.save('detalle_turno_' + chosenMonth + '.pdf');
    };

    onMounted(() => {
      fetchEvents();
      nextTick();
      if (calendar.value && calendar.value.getApi) {
        calendar.value.getApi().render();
      }
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 1);
    });

    return {
      calendarOptions,
      isModalOpen,
      selectedDate,
      selectedEvent, 
      nombresaliente,
      calendar,
      handleDateClick,
      closeModal,
      getUserName,
      nextTick,
      exportToPDF,
      esLocale,
      documentTextOutline,
    };
  },
};
</script>

<style scoped>
  .fc-event {
    background-color: lightgreen !important;
    border-color: lightgreen !important;
  }
</style>