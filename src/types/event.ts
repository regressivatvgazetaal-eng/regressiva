export interface Event {
  id: string;
  name: string;
  defaultStartTime?: string;
  defaultEndTime?: string;
}

export const DEFAULT_EVENTS: Event[] = [
  { id: "al1", name: "AL 1", defaultStartTime: "06:00:00", defaultEndTime: "07:00:00" },
  { id: "al2", name: "AL 2", defaultStartTime: "12:00:00", defaultEndTime: "12:30:00" },
  { id: "gazeta-esporte", name: "Gazeta Esporte", defaultStartTime: "18:00:00", defaultEndTime: "18:45:00" },
];
