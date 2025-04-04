import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { API_BASE_URL } from '../config';

function AppointmentForm({ doctor }) {
  const { user } = useAuth();
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTimeSlots = async () => {
      if (!doctor || !doctor._id) {
        setMessage('No doctor selected');
        return;
      }

      setLoading(true);
      setMessage('');
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_BASE_URL}/api/patient/timeslots/${doctor._id}`, {
          headers: { 'x-auth-token': token },
        });
        console.log('Time slots response:', res.data);
        setTimeSlots(Array.isArray(res.data) ? res.data : []);
        if (!res.data.length) setMessage('No available time slots for this doctor.');
      } catch (err) {
        console.error('Error fetching time slots:', err.response?.data || err.message);
        if (err.response?.status === 404) {
          setMessage('Doctor not found or has no available time slots.');
        } else if (err.response?.status === 403) {
          setMessage('You are not authorized to view time slots.');
        } else {
          setMessage('Failed to load time slots. Please try again.');
        }
        setTimeSlots([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTimeSlots();
  }, [doctor]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTimeSlot) {
      setMessage('Please select a time slot');
      return;
    }

    setLoading(true);
    setMessage('');
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `${API_BASE_URL}/api/patient/book`,
        { timeSlotId: selectedTimeSlot },
        { headers: { 'x-auth-token': token } }
      );
      setMessage(`Appointment booked successfully with ${doctor.name}`);
      setSelectedTimeSlot('');
      setTimeSlots(timeSlots.filter((slot) => slot._id !== selectedTimeSlot));
      setSelectedDate(null);
    } catch (err) {
      console.error('Error booking appointment:', err.response?.data || err.message);
      setMessage(err.response?.data?.msg || 'Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };
  const filteredTimeSlots = selectedDate
    ? timeSlots.filter((slot) => {
        const slotDate = new Date(slot.date).toDateString();
        const selected = new Date(selectedDate).toDateString();
        return slotDate === selected;
      })
    : [];

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '10px', borderRadius: '5px' }}>
      <h3 style={{ marginBottom: '15px' }}>Book Appointment with {doctor?.name || 'Unknown Doctor'}</h3>
      {loading && <p>Loading...</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Select Date:</label>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => {
              setSelectedDate(date);
              setSelectedTimeSlot(''); 
            }}
            minDate={new Date()}
            dateFormat="MMMM d, yyyy"
            placeholderText="Select a date"
            style={{ width: '100%', padding: '8px', borderRadius: '4px' }}
            disabled={loading}
          />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>
            Select Time Slot:
          </label>
          <select
            value={selectedTimeSlot}
            onChange={(e) => setSelectedTimeSlot(e.target.value)}
            style={{ width: '100%', padding: '8px', borderRadius: '4px' }}
            disabled={loading || !selectedDate || !filteredTimeSlots.length}
          >
            <option value="">-- Select a time slot --</option>
            {filteredTimeSlots.map((slot) => (
              <option key={slot._id} value={slot._id}>
                {slot.startTime} - {slot.endTime}
              </option>
            ))}
          </select>
          {!filteredTimeSlots.length && selectedDate && (
            <p style={{ color: 'gray', marginTop: '5px' }}>No time slots available for this date.</p>
          )}
        </div>
        <button
          type="submit"
          style={{
            padding: '8px 16px',
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
          disabled={loading || !selectedTimeSlot}
        >
          Book Now
        </button>
      </form>
      {message && (
        <p style={{ marginTop: '10px', color: message.includes('success') ? 'green' : 'red' }}>
          {message}
        </p>
      )}
    </div>
  );
}

export default AppointmentForm;