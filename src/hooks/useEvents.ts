import { useState, useEffect } from "react";
import { Event, DEFAULT_EVENTS } from "@/types/event";

const STORAGE_KEY = "tv-gazeta-events";
const CURRENT_EVENT_KEY = "tv-gazeta-current-event";

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_EVENTS;
  });

  const [currentEventId, setCurrentEventId] = useState<string | null>(() => {
    const stored = localStorage.getItem(CURRENT_EVENT_KEY);
    return stored || (events.length > 0 ? events[0].id : null);
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    if (currentEventId) {
      localStorage.setItem(CURRENT_EVENT_KEY, currentEventId);
    }
  }, [currentEventId]);

  const currentEvent = events.find((e) => e.id === currentEventId) || null;

  const addEvent = (event: Omit<Event, "id">) => {
    const newEvent: Event = {
      ...event,
      id: `event-${Date.now()}`,
    };
    setEvents([...events, newEvent]);
    return newEvent;
  };

  const updateEvent = (id: string, updates: Partial<Omit<Event, "id">>) => {
    setEvents(events.map((e) => (e.id === id ? { ...e, ...updates } : e)));
  };

  const deleteEvent = (id: string) => {
    setEvents(events.filter((e) => e.id !== id));
    if (currentEventId === id) {
      setCurrentEventId(events.length > 1 ? events[0].id : null);
    }
  };

  const reorderEvents = (newOrder: Event[]) => {
    setEvents(newOrder);
  };

  const isNameUnique = (name: string, excludeId?: string) => {
    return !events.some((e) => e.name === name && e.id !== excludeId);
  };

  const exportEvents = () => {
    const dataStr = JSON.stringify(events, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "eventos-tv-gazeta.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  const importEvents = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string) as Event[];
        if (Array.isArray(imported)) {
          setEvents(imported);
        }
      } catch (error) {
        console.error("Erro ao importar eventos:", error);
      }
    };
    reader.readAsText(file);
  };

  return {
    events,
    currentEvent,
    currentEventId,
    setCurrentEventId,
    addEvent,
    updateEvent,
    deleteEvent,
    reorderEvents,
    isNameUnique,
    exportEvents,
    importEvents,
  };
};
