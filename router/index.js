import { createRouter, createWebHistory } from "vue-router";
import EventList from "../components/EventList.vue";
import AddEvent from "../components/AddEvent.vue";
import EditEvent from "../components/EditEvent.vue";

const routes = [
  { path: "/", component: EventList },
  { path: "/add", component: AddEvent },
  { path: "/edit/:id", component: EditEvent, props: true }
];

export default createRouter({
  history: createWebHistory(),
  routes
});
