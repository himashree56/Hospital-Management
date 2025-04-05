import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { API_BASE_URL } from '../config';
import { useParams } from 'react-router-dom';

const AppointmentBooking = () => {
  const { user } = useContext(AuthContext);
  const { doctorId } = useParams();
  const [doctor, setDoctor] = useState('');
  const [date, setDate] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [error, setError] = useState('')
  useEffect(() => {
    if (!doctorId) {
      setError('No doctor selected.');
      return;
    }

    fetch(`${API_BASE_URL}/api/doctors/id/${doctorId}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError('Doctor not found or not approved.');
        } else {
          setDoctor(data);
          setError('');
        }
      })
      .catch((err) => {
        console.error('Error fetching doctor:', err);
        setError('Error fetching doctor details.');
      });
  }, [doctorId]);
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/appointments`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError('Error fetching appointments: ' + data.error);
        } else {
          setAppointments(data);
        }
      })
      .catch((err) => {
        console.error('Error fetching appointments:', err);
        setError('Error fetching appointments. Please try again later.');
      });
  }, []);
  useEffect(() => {
    if (!doctor || !date) {
      setTimeSlots([]);
      setSelectedTimeSlot('');
      return;
    }

    fetch(`${API_BASE_URL}/api/appointments/availability/${doctor._id}?date=${date}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    })
    .then((res) => res.json())
      .then((data) => {
        if (data.error || !data.timeSlots || data.timeSlots.length === 0) {
          setTimeSlots([]);
          setSelectedTimeSlot('');
          setError(data.error || 'No time slots available for the selected date.');
        } else {
          setTimeSlots(data.timeSlots);
          setSelectedTimeSlot('');
          setError('');
        }
      })
      .catch((err) => {
        console.error('Error fetching time slots:', err);
        setError('Error fetching time slots. Please try again later.');
      });
  }, [doctor, date]);
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!doctor || !date || !selectedTimeSlot) {
      setError('Please select a date and time slot.');
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/api/appointments/book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          doctorId: doctor._id,
          date,
          timeSlot: selectedTimeSlot,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        alert('Appointment booked successfully!');
        setAppointments([...appointments, data.appointment]);
        setDate('');
        setSelectedTimeSlot('');
        setTimeSlots([]);
      } else {
        alert(data.message || 'Failed to book appointment.');
      }
    } catch (error) {
      console.error('Booking failed', error);
      setError('Error booking appointment. Please try again later.');
    }
  };

  const handleCancel = async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/appointments/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      });
      if (res.ok) {
        alert('Appointment canceled!');
        setAppointments(appointments.filter((appt) => appt._id !== id));
      }else{
        const data = await res.json();
        setError(data.message || 'Failed to cancel appointment.');
      }
    } catch (error) {
      console.error('Cancel failed', error);
      setError('Error canceling appointment. Please try again later.');
    }
  };

  return (
    <div className="appointment-container">
      {doctor ? (
        <>
          <h2>Book Appointment with {doctor.name}</h2>
          <p>Specialization: {doctor.specialization}</p>
          <p>Bio: {doctor.bio}</p>
          <form onSubmit={handleSubmit}>
            <label>Select Date:</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              required
            />
            <label>Select Time Slot:</label>
            <select
              value={selectedTimeSlot}
              onChange={(e) => setSelectedTimeSlot(e.target.value)}
              required
              disabled={!timeSlots.length}
            >
              <option value="">-- Select a time slot --</option>
              {timeSlots.map((slot, index) => (
                <option key={index} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <button type="submit">Book Now</button>
          </form>
      <h3>Your Appointments</h3>
      <ul>
        {appointments.map((appt) => (
          <li key={appt._id}>
          {appt.doctorName} - {appt.date} - {appt.timeSlot}{' '}
          <button onClick={() => handleCancel(appt._id)}>Cancel</button>
        </li>
      ))}
    </ul>
  </>
) : (
  <p>{error || 'Loading doctor details...'}</p>
)}
    </div>
  );
};

export default AppointmentBooking;