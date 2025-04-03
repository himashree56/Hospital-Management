import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

function PatientDashboard() {
  const { user } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    if (user?.role === 'patient') {
      axios.get('http://localhost:5000/api/patient/appointments')
        .then(res => setAppointments(res.data));
    }
  }, [user]);

  const handleCancel = async (id) => {
    await axios.put(`http://localhost:5000/api/patient/cancel/${id}`);
    setAppointments(appointments.map(a => a._id === id ? { ...a, status: 'cancelled' } : a));
  };

  if (user?.role !== 'patient') return <h2>Access Denied</h2>;

  return (
    <div>
      <h1>Patient Dashboard</h1>
      <h2>Your Appointments</h2>
      {appointments.map(apt => (
        <div key={apt._id}>
          <p>Doctor: {apt.doctorId.name}</p>
          <p>Date: {new Date(apt.timeSlotId.date).toLocaleDateString()}</p>
          <p>Time: {apt.timeSlotId.startTime} - {apt.timeSlotId.endTime}</p>
          <p>Status: {apt.status}</p>
          {apt.status !== 'cancelled' && <button onClick={() => handleCancel(apt._id)}>Cancel</button>}
        </div>
      ))}
    </div>
  );
}

export default PatientDashboard;