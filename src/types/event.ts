export interface Event {
  id: string;
  name: string;
  defaultStartTime?: string;
  defaultEndTime?: string;
}

export const DEFAULT_EVENTS: Event[] = [
  { id: "bda", name: "Bom dia Alagoas", defaultStartTime: "06:00:00", defaultEndTime: "09:00:00" },
  { id: "boletim-gazeta", name: "Boletim Gazeta", defaultStartTime: "09:00:00", defaultEndTime: "10:15:00" },
  { id: "pravoce", name: "AL 1", defaultStartTime: "10:15:00", defaultEndTime: "11:30:00" },
  { id: "al1", name: "AL 1", defaultStartTime: "11:30:00", defaultEndTime: "13:00:00" },
  { id: "gazeta-esporte", name: "Gazeta Esporte", defaultStartTime: "13:00:00", defaultEndTime: "13:30:00" },
  { id: "acorda-metropoles", name: "Acorda Metrópoles", defaultStartTime: "14:00:00", defaultEndTime: "17:00:00" },
  { id: "edicao-das-cinco", name: "Edição das Cinco", defaultStartTime: "17:00:00", defaultEndTime: "19:00:00" },
  { id: "al2", name: "AL 2", defaultStartTime: "19:00:00", defaultEndTime: "20:00:00" },
  { id: "edicao-das-nove", name: "Edição das Nove", defaultStartTime: "21:00:00", defaultEndTime: "22:00:00" },
];
