import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Event } from "@/types/event";

interface EventSelectorProps {
  events: Event[];
  currentEventId: string | null;
  onEventChange: (eventId: string) => void;
  onManageClick: () => void;
}

const EventSelector = ({
  events,
  currentEventId,
  onEventChange,
  onManageClick,
}: EventSelectorProps) => {
  return (
    <div className="flex gap-2 items-center justify-center">
      <Select value={currentEventId || undefined} onValueChange={onEventChange}>
        <SelectTrigger className="w-[280px] h-12 text-lg font-bold uppercase bg-card border-2">
          <SelectValue placeholder="Selecione um evento" />
        </SelectTrigger>
        <SelectContent>
          {events.map((event) => (
            <SelectItem key={event.id} value={event.id} className="text-lg">
              {event.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        onClick={onManageClick}
        size="lg"
        variant="outline"
        className="h-12 gap-2 uppercase font-bold"
      >
        <Settings className="h-5 w-5" />
        Gerenciar
      </Button>
    </div>
  );
};

export default EventSelector;
