import { cn } from "@/lib/utils";

interface TimerDisplayProps {
  label: string;
  time: string;
  variant: "safe" | "running" | "warning" | "alert" | "overflow";
  visible?: boolean;
  eventName?: string;
}

const TimerDisplay = ({ label, time, variant, visible = true, eventName }: TimerDisplayProps) => {
  if (!visible) return null;

  const variantStyles = {
    safe: "bg-timer-safe text-timer-safe-foreground",
    running: "bg-timer-running text-timer-running-foreground",
    warning: "bg-timer-warning text-timer-warning-foreground",
    alert: "bg-timer-alert text-timer-alert-foreground",
    overflow: "bg-timer-overflow text-timer-overflow-foreground",
  };

  return (
    <div
      className={cn(
        "border-4 border-foreground/20 rounded-lg p-6 md:p-8 transition-all duration-300 text-center",
        variantStyles[variant]
      )}
    >
      <div className="text-2xl md:text-3xl lg:text-4xl font-bold uppercase tracking-wider mb-3">
        {label}
        {eventName && (
          <div className="text-xl md:text-2xl lg:text-3xl mt-2 text-foreground/80">
            {eventName}
          </div>
        )}
      </div>
      <div className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-mono font-black tracking-tight leading-none">
        {time}
      </div>
    </div>
  );
};

export default TimerDisplay;
