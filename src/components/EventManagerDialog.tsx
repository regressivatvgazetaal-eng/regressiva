import { useState } from "react";
import { Trash2, Edit, GripVertical, Plus, Download, Upload } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Event } from "@/types/event";

interface EventManagerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  events: Event[];
  onAdd: (event: Omit<Event, "id">) => void;
  onUpdate: (id: string, updates: Partial<Omit<Event, "id">>) => void;
  onDelete: (id: string) => void;
  isNameUnique: (name: string, excludeId?: string) => boolean;
  onExport: () => void;
  onImport: (file: File) => void;
}

const EventManagerDialog = ({
  open,
  onOpenChange,
  events,
  onAdd,
  onUpdate,
  onDelete,
  isNameUnique,
  onExport,
  onImport,
}: EventManagerDialogProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ 
    name: "", 
    defaultStartTime: "", 
    defaultEndTime: "" 
  });
  const [error, setError] = useState("");

  const formatTimeInput = (value: string): string => {
    const numbers = value.replace(/\D/g, "");
    const limited = numbers.slice(0, 6);
    
    if (limited.length <= 2) {
      return limited;
    } else if (limited.length <= 4) {
      return `${limited.slice(0, 2)}:${limited.slice(2)}`;
    } else {
      return `${limited.slice(0, 2)}:${limited.slice(2, 4)}:${limited.slice(4)}`;
    }
  };

  const resetForm = () => {
    setFormData({ name: "", defaultStartTime: "", defaultEndTime: "" });
    setEditingId(null);
    setError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.name.trim()) {
      setError("Nome é obrigatório");
      return;
    }

    if (!isNameUnique(formData.name.trim(), editingId || undefined)) {
      setError("Já existe um evento com este nome");
      return;
    }

    if (editingId) {
      onUpdate(editingId, {
        name: formData.name.trim(),
        defaultStartTime: formData.defaultStartTime || undefined,
        defaultEndTime: formData.defaultEndTime || undefined,
      });
    } else {
      onAdd({
        name: formData.name.trim(),
        defaultStartTime: formData.defaultStartTime || undefined,
        defaultEndTime: formData.defaultEndTime || undefined,
      });
    }

    resetForm();
  };

  const handleEdit = (event: Event) => {
    setEditingId(event.id);
    setFormData({
      name: event.name,
      defaultStartTime: event.defaultStartTime || "",
      defaultEndTime: event.defaultEndTime || "",
    });
    setError("");
  };

  const handleImportClick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        onImport(file);
      }
    };
    input.click();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold uppercase">
            Gerenciar Eventos
          </DialogTitle>
          <DialogDescription>
            Adicione, edite ou remova eventos/programas
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 bg-muted p-4 rounded-lg">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Evento *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: AL 1, Gazeta Esporte"
                className="bg-background"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="startTime">Horário de Início Padrão (HH:MM:SS)</Label>
              <Input
                id="startTime"
                type="text"
                value={formData.defaultStartTime}
                onChange={(e) => setFormData({ ...formData, defaultStartTime: formatTimeInput(e.target.value) })}
                placeholder="Ex: 06:00:00"
                className="bg-background font-mono"
                maxLength={8}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime">Horário de Término Padrão (HH:MM:SS)</Label>
              <Input
                id="endTime"
                type="text"
                value={formData.defaultEndTime}
                onChange={(e) => setFormData({ ...formData, defaultEndTime: formatTimeInput(e.target.value) })}
                placeholder="Ex: 07:00:00"
                className="bg-background font-mono"
                maxLength={8}
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <div className="flex gap-2">
              <Button type="submit" className="flex-1">
                <Plus className="mr-2 h-4 w-4" />
                {editingId ? "Atualizar" : "Adicionar"}
              </Button>
              {editingId && (
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
              )}
            </div>
          </form>

          {/* Import/Export */}
          <div className="flex gap-2">
            <Button variant="outline" onClick={onExport} className="flex-1">
              <Download className="mr-2 h-4 w-4" />
              Exportar JSON
            </Button>
            <Button variant="outline" onClick={handleImportClick} className="flex-1">
              <Upload className="mr-2 h-4 w-4" />
              Importar JSON
            </Button>
          </div>

          {/* Events List */}
          <div className="space-y-2">
            <Label>Eventos Cadastrados ({events.length})</Label>
            <div className="space-y-2">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center gap-2 p-3 bg-card border rounded-lg"
                >
                  <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />
                  <div className="flex-1">
                    <p className="font-bold">{event.name}</p>
                    <div className="text-sm text-muted-foreground font-mono">
                      {event.defaultStartTime && (
                        <span>Início: {event.defaultStartTime}</span>
                      )}
                      {event.defaultStartTime && event.defaultEndTime && <span> | </span>}
                      {event.defaultEndTime && (
                        <span>Fim: {event.defaultEndTime}</span>
                      )}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEdit(event)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onDelete(event.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventManagerDialog;
