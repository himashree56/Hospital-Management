import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const AppointmentBooking = () => {
  const { user } = useContext(AuthContext);
  const [doctor, setDoctor] = useState('');
  const [date, setDate] = useState('');
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/appointments', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    })
      .then((res) => res.json())
      .then((data) => setAppointments(data))
      .catch((err) => console.error('Error fetching appointments:', err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ doctor, date }),
      });
      const data = await res.json();
      if (res.ok) {
        alert('Appointment booked successfully!');
        setAppointments([...appointments, data]);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Booking failed', error);
    }
  };

  const handleCancel = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/appointments/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      });
      if (res.ok) {
        alert('Appointment canceled!');
        setAppointments(appointments.filter((appt) => appt._id !== id));
      }
    } catch (error) {
      console.error('Cancel failed', error);
    }
  };

  return (
    <div className="appointment-container">
      <h2>Book Appointment</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Doctor Name" value={doctor} onChange={(e) => setDoctor(e.target.value)} required />
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        <button type="submit">Book</button>
      </form>
      <h3>Your Appointments</h3>
      <ul>
        {appointments.map((appt) => (
          <li key={appt._id}>
            {appt.doctor} - {appt.date} <button onClick={() => handleCancel(appt._id)}>Cancel</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AppointmentBooking;