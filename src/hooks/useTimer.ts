import { useState, useEffect, useCallback } from "react";

const parseTimeString = (timeString: string): number => {
  const parts = timeString.split(":").map((p) => parseInt(p) || 0);
  
  if (parts.length === 3) {
    const [hours, minutes, seconds] = parts;
    return hours * 3600 + minutes * 60 + seconds;
  }
  
  return 0;
};

const getCurrentTimeInSeconds = (): number => {
  const now = new Date();
  return now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
};

const formatTime = (totalSeconds: number): string => {
  const hours = Math.floor(Math.abs(totalSeconds) / 3600);
  const minutes = Math.floor((Math.abs(totalSeconds) % 3600) / 60);
  const seconds = Math.abs(totalSeconds) % 60;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}:${String(seconds).padStart(2, "0")}`;
};

export const useTimer = (initialStartTime?: string, initialEndTime?: string) => {
  const [startTime, setStartTime] = useState(initialStartTime || "");
  const [endTime, setEndTime] = useState(initialEndTime || "");
  const [currentSeconds, setCurrentSeconds] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSeconds(getCurrentTimeInSeconds());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (startTime) {
      const startSeconds = parseTimeString(startTime);
      setHasStarted(currentSeconds >= startSeconds);
    }
  }, [currentSeconds, startTime]);

  const calculateRemaining = (): number => {
    if (!hasStarted && startTime) {
      // Antes do evento começar: calcular tempo até o início
      const startSeconds = parseTimeString(startTime);
      let diff = startSeconds - currentSeconds;
      
      // Se a diferença for negativa, significa que o horário de início já passou
      if (diff < 0) {
        diff += 24 * 3600; // Adiciona 24 horas
      }
      
      return diff;
    } else if (hasStarted && endTime) {
      // Evento começou: calcular tempo até o fim
      const endSeconds = parseTimeString(endTime);
      let diff = endSeconds - currentSeconds;
      
      // Se a diferença for negativa, significa que passou do horário
      if (diff < 0) {
        return 0;
      }
      
      return diff;
    }
    
    return 0;
  };

  const calculateOverflow = (): number => {
    if (hasStarted && endTime) {
      const endSeconds = parseTimeString(endTime);
      const diff = currentSeconds - endSeconds;
      
      if (diff > 0) {
        return diff;
      }
    }
    
    return 0;
  };

  const remainingSeconds = calculateRemaining();
  const overflowSeconds = calculateOverflow();

  const getCountdownVariant = (): "running" | "warning" | "alert" => {
    if (remainingSeconds > 30) return "running";
    if (remainingSeconds > 10) return "warning";
    return "alert";
  };

  const reset = useCallback(() => {
    setCurrentSeconds(getCurrentTimeInSeconds());
  }, []);

  return {
    remainingTime: formatTime(remainingSeconds),
    overflowTime: formatTime(overflowSeconds),
    startTime,
    endTime,
    setStartTime,
    setEndTime,
    reset,
    isOverflow: overflowSeconds > 0,
    hasStarted,
    countdownVariant: getCountdownVariant(),
  };
};
