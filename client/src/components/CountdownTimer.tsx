import { useState, useEffect } from "react";

export const calculateTimeLeft = () => {
  const now = new Date()
  const nextReset = new Date(now)
  nextReset.setUTCDate(now.getUTCDate() + (now.getUTCHours() >= 0 ? 1 : 0))
  nextReset.setUTCHours(0, 0, 0, 0)
  const diffMs = nextReset.getTime() - now.getTime()
  const hours = Math.floor(diffMs / (1000 * 60 * 60))
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
  
  return {hours, minutes, seconds}
}


const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({hours: 0, minutes: 0, seconds: 0})

  useEffect(() => {
    const timer = setInterval(() => {
        setTimeLeft(calculateTimeLeft())
    }, 1000);
    setTimeLeft(calculateTimeLeft())
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="mt-2 text-white">
        Time until next weapon: {String(timeLeft.hours).padStart(2, '0')}:
        {String(timeLeft.minutes).padStart(2, '0')}:
        {String(timeLeft.seconds).padStart(2, '0')}
    </div>
  );
};

export default CountdownTimer;