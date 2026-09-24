'use client';

import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export default function RentBadge({ availableAt }) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    if (!availableAt) return;
    
    const target = new Date(availableAt).getTime();
    
    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = target - now;

      if (distance < 0) {
        setTimeLeft('');
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      
      let str = '';
      if (days > 0) str += `${days}h `;
      if (hours > 0 || days > 0) str += `${hours}j `;
      str += `${minutes}m`;
      
      setTimeLeft(str);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000); // update every minute
    
    return () => clearInterval(interval);
  }, [availableAt]);

  const isRented = availableAt && new Date(availableAt) > new Date();

  if (!isRented || !timeLeft) {
    return (
      <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0, 255, 204, 0.95)', color: '#000', padding: '6px 12px', borderRadius: '12px', boxShadow: '0 0 15px rgba(0, 255, 204, 0.6)', display: 'flex', flexDirection: 'column', alignItems: 'center', backdropFilter: 'blur(5px)' }}>
        <span style={{ fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
          Tersedia
        </span>
      </div>
    );
  }

  return (
    <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(255, 77, 77, 0.95)', color: 'white', padding: '6px 12px', borderRadius: '12px', boxShadow: '0 0 15px rgba(255, 77, 77, 0.6)', display: 'flex', flexDirection: 'column', alignItems: 'center', backdropFilter: 'blur(5px)' }}>
      <span style={{ fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '2px' }}>
        Sedang Di Rental
      </span>
      <span style={{ fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(0,0,0,0.3)', padding: '2px 6px', borderRadius: '4px' }}>
        <Clock size={10} /> {timeLeft}
      </span>
    </div>
  );
}
