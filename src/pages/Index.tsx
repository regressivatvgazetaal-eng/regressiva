import { useState, useEffect, useCallback } from "react";
import TimerDisplay from "@/components/TimerDisplay";
import TimerControls from "@/components/TimerControls";
import EventSelector from "@/components/EventSelector";
import EventManagerDialog from "@/components/EventManagerDialog";
import { useClock } from "@/hooks/useClock";
import { useTimer } from "@/hooks/useTimer";
import { useEvents } from "@/hooks/useEvents";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Upload } from "lucide-react";

const Index = () => {
  const [customLogo, setCustomLogo] = useState<string | null>(
    localStorage.getItem("customLogo")
  );
  const [managerOpen, setManagerOpen] = useState(false);
  const [logoUploadOpen, setLogoUploadOpen] = useState(false);
  const [timerControlsOpen, setTimerControlsOpen] = useState(false);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  
  const currentTime = useClock();
  const {
    events,
    currentEvent,
    currentEventId,
    setCurrentEventId,
    addEvent,
    updateEvent,
    deleteEvent,
    isNameUnique,
    exportEvents,
    importEvents,
  } = useEvents();

  const {
    remainingTime,
    overflowTime,
    startTime,
    endTime,
    setStartTime,
    setEndTime,
    reset,
    isOverflow,
    hasStarted,
    countdownVariant,
  } = useTimer(currentEvent?.defaultStartTime, currentEvent?.defaultEndTime);

  // Apply default times when event changes
  useEffect(() => {
    if (currentEvent?.defaultStartTime) {
      setStartTime(currentEvent.defaultStartTime);
    }
    if (currentEvent?.defaultEndTime) {
      setEndTime(currentEvent.defaultEndTime);
    }
  }, [currentEventId, currentEvent, setStartTime, setEndTime]);

  // Keyboard shortcuts handler
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Ctrl + Q: Open reset confirmation dialog
    if (event.ctrlKey && event.key.toLowerCase() === 'q') {
      event.preventDefault();
      setResetConfirmOpen(true);
    }
    
    // F12: Open event manager dialog
    if (event.key === 'F12') {
      event.preventDefault();
      setManagerOpen(true);
    }
  }, []);

  // Global keyboard event listener
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  const handleConfirmReset = () => {
    reset();
    setResetConfirmOpen(false);
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setCustomLogo(result);
        localStorage.setItem("customLogo", result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setCustomLogo(null);
    localStorage.removeItem("customLogo");
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-card border-4 border-foreground/20 rounded-lg p-6 inline-block">
            <div className="flex items-center justify-center">
              {customLogo ? (
                <img 
                  src={customLogo} 
                  alt="Logo Customizado" 
                  className="max-h-32 w-auto object-contain"
                />
              ) : (
                <div className="text-center px-8 py-4">
                  <p className="text-2xl md:text-3xl font-bold uppercase tracking-wide text-muted-foreground">
                    TV Gazeta AL
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setLogoUploadOpen(true)}
              className="text-xs uppercase px-3 py-1 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
            >
              <Upload className="w-3 h-3" />
              Upload Logo
            </button>
            {customLogo && (
              <button
                onClick={handleRemoveLogo}
                className="text-xs uppercase px-3 py-1 bg-destructive text-destructive-foreground rounded hover:bg-destructive/90 transition-colors"
              >
                Remover
              </button>
            )}
          </div>
        </div>

        <header className="text-center mb-8 space-y-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight text-foreground">
            Painel de Controle de Tempo
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground uppercase tracking-wide">
            TV Gazeta de Alagoas
          </p>
          
          {currentEvent && (
            <div className="bg-primary/10 border-2 border-primary rounded-lg p-4 inline-block">
              <p className="text-sm text-muted-foreground uppercase tracking-wide">Evento Atual</p>
              <p className="text-2xl md:text-3xl font-black uppercase text-primary">
                {currentEvent.name}
              </p>
            </div>
          )}
        </header>

        <EventSelector
          events={events}
          currentEventId={currentEventId}
          onEventChange={setCurrentEventId}
          onManageClick={() => setManagerOpen(true)}
        />

        <div className="grid gap-6">
          <TimerDisplay
            label="Horário Local"
            time={currentTime}
            variant="safe"
          />

          <TimerDisplay
            label={hasStarted ? "Falta para o Fim" : "Falta para Começar"}
            time={remainingTime}
            variant={countdownVariant}
            eventName={currentEvent?.name}
          />

          <TimerDisplay
            label="Estouro de Tempo"
            time={overflowTime}
            variant="overflow"
            visible={isOverflow}
          />
        </div>

        <div className="flex justify-center">
          <button
            onClick={() => setTimerControlsOpen(true)}
            className="text-lg uppercase px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-bold"
          >
            Configurar Horários
          </button>
        </div>

        <EventManagerDialog
          open={managerOpen}
          onOpenChange={setManagerOpen}
          events={events}
          onAdd={addEvent}
          onUpdate={updateEvent}
          onDelete={deleteEvent}
          isNameUnique={isNameUnique}
          onExport={exportEvents}
          onImport={importEvents}
        />

        <Dialog open={logoUploadOpen} onOpenChange={setLogoUploadOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload de Logo</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Selecione uma imagem para usar como logo
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  handleLogoUpload(e);
                  setLogoUploadOpen(false);
                }}
                className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer"
              />
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={timerControlsOpen} onOpenChange={setTimerControlsOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Configurar Horários do Evento</DialogTitle>
            </DialogHeader>
            <TimerControls
              startTime={startTime}
              endTime={endTime}
              hasStarted={hasStarted}
              onStartTimeChange={setStartTime}
              onEndTimeChange={setEndTime}
              onReset={() => {
                reset();
                setTimerControlsOpen(false);
              }}
            />
          </DialogContent>
        </Dialog>

        <AlertDialog open={resetConfirmOpen} onOpenChange={setResetConfirmOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Zerar Cronômetro</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja zerar o cronômetro? Esta ação irá resetar os horários de início e fim para os valores padrão do evento.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmReset}>
                Confirmar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default Index;
