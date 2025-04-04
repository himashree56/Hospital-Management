import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { API_BASE_URL } from '../config';

function PatientDashboard() {
  const { user } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.role !== 'patient') {
      setError('Access Denied');
      setLoading(false);
      return;
    }

    const fetchAppointments = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/appointments`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setAppointments(res.data);
        setError('');
      } catch (err) {
        console.error('Error fetching appointments:', err);
        setError('Error fetching appointments. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [user]);

  const handleCancel = async (id) => {
    try {
      const res = await axios.delete(`${API_BASE_URL}/api/appointments/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (res.status === 200) {
        setAppointments(appointments.filter((apt) => apt._id !== id));
        alert('Appointment canceled successfully!');
      }
    } catch (err) {
      console.error('Error canceling appointment:', err);
      setError('Error canceling appointment. Please try again later.');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h1>Patient Dashboard</h1>
      <h2>Your Appointments</h2>
      {appointments.length === 0 ? (
        <p>No appointments found.</p>
      ) : (
        appointments.map((apt) => (
          <div key={apt._id}>
            <p>Doctor: {apt.doctorName}</p>
            <p>Date: {new Date(apt.date).toLocaleDateString()}</p>
            <p>Time: {apt.timeSlot}</p>
            <p>Status: {apt.status || 'Scheduled'}</p>
            {(!apt.status || apt.status !== 'cancelled') && (
              <button onClick={() => handleCancel(apt._id)}>Cancel</button>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default PatientDashboard;