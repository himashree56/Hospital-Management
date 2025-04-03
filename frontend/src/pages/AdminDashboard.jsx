import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    if (user?.role === 'admin') {
      axios.get('http://localhost:5000/api/admin/doctors').then(res => setDoctors(res.data));
      axios.get('http://localhost:5000/api/admin/appointments').then(res => setAppointments(res.data));
    }
  }, [user]);

  const handleApprove = async (id) => {
    await axios.put(`http://localhost:5000/api/admin/approve/${id}`);
    setDoctors(doctors.map(d => d._id === id ? { ...d, isApproved: true } : d));
  };

  if (user?.role !== 'admin') return <h2>Access Denied</h2>;

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <h2>Doctors</h2>
      {doctors.map(doc => (
        <div key={doc._id}>
          <p>Name: {doc.name}</p>
          <p>Email: {doc.email}</p>
          <p>Status: {doc.isApproved ? 'Approved' : 'Pending'}</p>
          {!doc.isApproved && <button onClick={() => handleApprove(doc._id)}>Approve</button>}
        </div>
      ))}
      <h2>All Appointments</h2>
      {appointments.map(apt => (
        <div key={apt._id}>
          <p>Patient: {apt.patientId.name}</p>
          <p>Doctor: {apt.doctorId.name}</p>
          <p>Date: {new Date(apt.timeSlotId.date).toLocaleDateString()}</p>
          <p>Time: {apt.timeSlotId.startTime} - {apt.timeSlotId.endTime}</p>
          <p>Status: {apt.status}</p>
        </div>
      ))}
    </div>
  );
}

export default AdminDashboard;