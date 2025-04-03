import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

function DoctorDashboard() {
  const { user } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  useEffect(() => {
    if (user?.role === 'doctor') {
      axios.get('http://localhost:5000/api/doctor/appointments').then(res => setAppointments(res.data));
      axios.get('http://localhost:5000/api/doctor/timeslots').then(res => setTimeSlots(res.data));
    }
  }, [user]);

  const handleAddTimeSlot = async (e) => {
    e.preventDefault();
    const res = await axios.post('http://localhost:5000/api/doctor/timeslots', { date, startTime, endTime });
    setTimeSlots([...timeSlots, res.data]);
  };

  if (user?.role !== 'doctor') return <h2>Access Denied</h2>;

  return (
    <div>
      <h1>Doctor Dashboard</h1>
      <h2>Add Time Slot</h2>
      <form onSubmit={handleAddTimeSlot}>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
        <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
        <button type="submit">Add</button>
      </form>
      <h2>Your Appointments</h2>
      {appointments.map(apt => (
        <div key={apt._id}>
          <p>Patient: {apt.patientId.name}</p>
          <p>Date: {new Date(apt.timeSlotId.date).toLocaleDateString()}</p>
          <p>Time: {apt.timeSlotId.startTime} - {apt.timeSlotId.endTime}</p>
          <p>Status: {apt.status}</p>
        </div>
      ))}
      <h2>Your Time Slots</h2>
      {timeSlots.map(slot => (
        <div key={slot._id}>
          <p>Date: {new Date(slot.date).toLocaleDateString()}</p>
          <p>Time: {slot.startTime} - {slot.endTime}</p>
          <p>{slot.isBooked ? 'Booked' : 'Available'}</p>
        </div>
      ))}
    </div>
  );
}

export default DoctorDashboard;