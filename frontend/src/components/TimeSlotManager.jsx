import React, { useState } from 'react';
import '../styles/TimeSlotManager.css';

const TimeSlotManager = () => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/doctors/availability', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ date, time }),
      });
      if (res.ok) {
        alert('Availability set successfully!');
      }
    } catch (error) {
      console.error('Failed to set availability', error);
    }
  };

 return (
    <div className="timeslot-container">
      <h2>Set Availability</h2>
      <form onSubmit={handleSubmit}>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        <input type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
        <button type="submit">Add Slot</button>
      </form>
    </div>
  );
};

export default TimeSlotManager;