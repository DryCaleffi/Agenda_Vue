// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import EventList from '../views/EventList.vue';
import CalendarView from '../views/CalendarView.vue';
import EventForm from '../components/EventForm.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: EventList
    },
    {
      path: '/calendar',
      name: 'calendar',
      component: CalendarView
    },
    {
      path: '/add',
      name: 'add',
      component: EventForm
    },
    {
      path: '/edit/:id',
      name: 'edit',
      component: EventForm
    }
  ]
});

export default router;