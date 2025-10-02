"use client";
import { useState, useEffect } from "react";
import { Badge } from "../ui/badge";
import { Clock, AlertTriangle } from "lucide-react";

function getNextMidnightUTC() {
  const now = new Date();
  const nextMidnight = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate() + 1,
      0,
      0,
      0
    )
  );
  return nextMidnight;
}

function getTimeLeft(endTime: Date) {
  const now = new Date();
  const difference = endTime.getTime() - now.getTime();

  if (difference <= 0) {
    return { hours: 0, minutes: 0, seconds: 0, isExpired: true };
  }

  const hours = Math.floor(difference / (1000 * 60 * 60));
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);

  return { hours, minutes, seconds, isExpired: false };
}

function ProductCardWithSale() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });
  const [saleEndTime, setSaleEndTime] = useState<Date | null>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const endTime = getNextMidnightUTC();
    setSaleEndTime(endTime);
    setTimeLeft(getTimeLeft(endTime));

    const timer = setInterval(() => {
      const newTimeLeft = getTimeLeft(endTime);
      setTimeLeft(newTimeLeft);
      
      if (newTimeLeft.isExpired) {
        setIsVisible(false);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!isVisible || timeLeft.isExpired) return null;

  const isUrgent = timeLeft.hours < 6;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className={`rounded-2xl p-6 shadow-lg border-2 ${
        isUrgent 
          ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white animate-pulse' 
          : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            <span className="text-lg font-bold">Deal Ends In</span>
          </div>
          {isUrgent && (
            <Badge variant="secondary" className="bg-white text-red-600 font-bold">
              <AlertTriangle className="h-3 w-3 mr-1" />
              HURRY!
            </Badge>
          )}
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: timeLeft.hours, label: 'Hours' },
            { value: timeLeft.minutes, label: 'Minutes' },
            { value: timeLeft.seconds, label: 'Seconds' }
          ].map((item, index) => (
            <div key={index} className="text-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
                <div className="text-2xl md:text-3xl font-bold tabular-nums">
                  {item.value.toString().padStart(2, '0')}
                </div>
                <div className="text-sm opacity-90 mt-1">{item.label}</div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 text-center text-sm opacity-90">
          ⚡ Offer expires at midnight. Don't miss out!
        </div>
      </div>
    </div>
  );
}

export { ProductCardWithSale };