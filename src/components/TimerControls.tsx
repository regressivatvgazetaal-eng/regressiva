import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RotateCcw } from "lucide-react";

interface TimerControlsProps {
  startTime: string;
  endTime: string;
  hasStarted: boolean;
  onStartTimeChange: (value: string) => void;
  onEndTimeChange: (value: string) => void;
  onReset: () => void;
}

const TimerControls = ({
  startTime,
  endTime,
  hasStarted,
  onStartTimeChange,
  onEndTimeChange,
  onReset,
}: TimerControlsProps) => {
  const formatTimeInput = (value: string): string => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, "");
    
    // Limita a 6 dígitos
    const limited = numbers.slice(0, 6);
    
    // Formata como HH:MM:SS
    if (limited.length <= 2) {
      return limited;
    } else if (limited.length <= 4) {
      return `${limited.slice(0, 2)}:${limited.slice(2)}`;
    } else {
      return `${limited.slice(0, 2)}:${limited.slice(2, 4)}:${limited.slice(4)}`;
    }
  };

  const handleStartTimeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatTimeInput(e.target.value);
    onStartTimeChange(formatted);
  };

  const handleEndTimeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatTimeInput(e.target.value);
    onEndTimeChange(formatted);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="startTime" className="text-lg font-bold uppercase">
          Horário de Início do Evento
        </Label>
        <Input
          id="startTime"
          type="text"
          value={startTime}
          onChange={handleStartTimeInput}
          placeholder="HH:MM:SS"
          className="text-2xl font-mono text-center h-14 bg-input border-2"
          maxLength={8}
        />
        <p className="text-sm text-muted-foreground">
          Formato: HH:MM:SS (ex: 06:00:00)
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="endTime" className="text-lg font-bold uppercase">
          Horário de Término do Evento
        </Label>
        <Input
          id="endTime"
          type="text"
          value={endTime}
          onChange={handleEndTimeInput}
          placeholder="HH:MM:SS"
          className="text-2xl font-mono text-center h-14 bg-input border-2"
          disabled={!hasStarted}
          maxLength={8}
        />
        <p className="text-sm text-muted-foreground">
          {hasStarted ? "Formato: HH:MM:SS (ex: 07:00:00)" : "Disponível após o início do evento"}
        </p>
      </div>

      <div className="flex gap-4">
        <Button
          onClick={onReset}
          size="lg"
          variant="outline"
          className="flex-1 h-16 text-xl font-bold uppercase"
        >
          <RotateCcw className="mr-2 h-6 w-6" />
          Atualizar
        </Button>
      </div>
    </div>
  );
};

export default TimerControls;
