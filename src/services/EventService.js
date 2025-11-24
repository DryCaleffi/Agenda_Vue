// src/services/EventService.js
const STORAGE_KEY = 'agenda_events_v2';

export default {
  getEvents() {
    const events = localStorage.getItem(STORAGE_KEY);
    return events ? JSON.parse(events) : [];
  },

  getEvent(id) {
    const events = this.getEvents();
    return events.find(e => e.id === id);
  },

  saveEvent(event) {
    const events = this.getEvents();
    if (event.id) {
      const index = events.findIndex(e => e.id === event.id);
      if (index !== -1) events[index] = event;
    } else {
      event.id = Date.now().toString(36) + Math.random().toString(36).substr(2);
      event.createdAt = new Date().toISOString();
      events.push(event);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  },

  deleteEvent(id) {
    let events = this.getEvents();
    events = events.filter(e => e.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  },

  importData(jsonData) {
    try {
      const parsed = JSON.parse(jsonData);
      if (Array.isArray(parsed)) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
        return true;
      }
    } catch (e) {
      console.error("Erro ao importar", e);
      return false;
    }
  },

  exportData() {
    return localStorage.getItem(STORAGE_KEY);
  }
};