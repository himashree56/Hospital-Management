import React, { useEffect, useState } from 'react';
import '../styles/DoctorDashboard.css';

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/doctors/appointments', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    })
      .then((res) => res.json())
      .then((data) => setAppointments(data))
      .catch((err) => console.error('Error fetching appointments:', err));
  }, []);

  return (
    <div className="dashboard-container">
      <h2>Doctor Dashboard</h2>
      <p>Manage your appointments here.</p>
      <ul>
        {appointments.map((appt) => (
          <li key={appt._id}>{appt.patientName} - {appt.date}</li>
        ))}
      </ul>
    </div>
  );
};

export default DoctorDashboard;