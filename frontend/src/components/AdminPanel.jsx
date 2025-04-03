import React, { useEffect, useState } from 'react';
import '../styles/AdminPanel.css';

const AdminPanel = () => {
  const [doctors, setDoctors] = useState([]);
  const [users, setUsers] = useState([]);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/doctors/pending', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    })
      .then((res) => res.json())
      .then((data) => setDoctors(data));

    fetch('http://localhost:5000/api/users', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    })
      .then((res) => res.json())
      .then((data) => setUsers(data));

    fetch('http://localhost:5000/api/appointments/all', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    })
      .then((res) => res.json())
      .then((data) => setAppointments(data));
  }, []);

  const handleApprove = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/doctors/approve/${id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      });
      if (res.ok) {
        setDoctors(doctors.filter((doc) => doc._id !== id));
      }
    } catch (error) {
      console.error('Approval failed', error);
    }
  };

  return (
    <div className="admin-container">
      <h2>Admin Panel</h2>
      <h3>Pending Doctor Approvals</h3>
      <ul>
        {doctors.map((doc) => (
          <li key={doc._id}>
            {doc.name} - {doc.specialization} <button onClick={() => handleApprove(doc._id)}>Approve</button>
          </li>
        ))}
      </ul>
      <h3>All Users</h3>
      <ul>
        {users.map((user) => (
          <li key={user._id}>{user.email} - {user.role}</li>
        ))}
      </ul>
      <h3>All Appointments</h3>
      <ul>
        {appointments.map((appt) => (
          <li key={appt._id}>{appt.doctor} - {appt.date}</li>
        ))}
      </ul>
    </div>
  );
};

export default AdminPanel;