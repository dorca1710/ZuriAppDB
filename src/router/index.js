import { createRouter, createWebHistory } from '@ionic/vue-router';
import Login from '../views/Login.vue';
import RecuperarC from '../views/RecuperarC.vue';
import HomePage from '../views/HomePage.vue';
import Perfil from '../views/Perfil.vue';
import Disponibilidad from '../views/Disponibilidad.vue';
import CalendarioTA from '../views/CalendarioTA.vue';
import Registro from '../views/Registro.vue'
import AsignaciondeTurnos from '../views/AsignaciondeTurnos.vue';
import * as Realm from "realm-web";

const app = Realm.getApp("zuriapp-bvqsg");

const routes = [
  {
    path: '/',
    redirect: '/api/zuriapp1/login'
  },
  {
    path: '/api/zuriapp1/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/api/zuriapp1/recuperarc',
    name: 'RecuperarC',
    component: RecuperarC
  },
  {
    path: '/api/zuriapp1/perfil',
    name: 'Perfil',
    component: Perfil
  },
  {
    path: '/api/zuriapp1/home',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/api/zuriapp1/disponibilidad',
    name: 'Disponibilidad',
    component: Disponibilidad
  },
  {
    path: '/api/zuriapp1/calendariota',
    name: 'CalendarioTA',
    component: CalendarioTA
  },
  {
    path: '/api/zuriapp1/registro',
    name: 'Registro',
    component: Registro
  },
  {
    path: '/api/zuriapp1/asignaciondeturnos',
    name: 'AsignaciondeTurnos',
    component: AsignaciondeTurnos
  }

];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});



export default router;