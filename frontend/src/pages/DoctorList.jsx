import { useState, useEffect } from 'react';
import axios from 'axios';
import DoctorCard from '../components/DoctorCard';
import AppointmentForm from '../components/AppointmentForm';

function DoctorList() {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/patient/doctors', {
          headers: { 'x-auth-token': token },
        });
        console.log('Doctors fetched:', res.data); 
        setDoctors(res.data);
      } catch (err) {
        console.error('Error fetching doctors:', err);
      }
    };
    fetchDoctors();
  }, []);

  const handleBook = (doctor) => {
    setSelectedDoctor(doctor);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '20px' }}>Available Doctors</h2>
      {doctors.length === 0 && <p>No doctors available at the moment.</p>}
      {doctors.map((doctor) => (
        <DoctorCard key={doctor._id} doctor={doctor} onBook={handleBook} />
      ))}
      {selectedDoctor && <AppointmentForm doctor={selectedDoctor} />}
    </div>
  );
}

export default DoctorList;