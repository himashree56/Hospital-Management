import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../config';
import { AuthContext } from '../context/AuthContext';
const DoctorList = () => {
  const { user } = useContext(AuthContext); 
  const [doctors, setDoctors] = useState([]);
  const [specialization, setSpecialization] = useState('');
  const [error, setError] = useState('');
  useEffect(() => {
    if (!user) {
      setError('Please log in to view doctors.');
      return;
    }
    const url = specialization
      ? `${API_BASE_URL}/api/doctors?specialization=${specialization}`
      : `${API_BASE_URL}/api/doctors`;
    fetch(url, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
          setDoctors([]);
        } else {
          setDoctors(data);
          setError('');
        }
      })
      .catch((err) => {
        console.error('Error fetching doctors:', err);
        setError('Error fetching doctors. Please try again later.');
      });
  }, [specialization, user]);
  return (
    <div className="doctor-list-container">
      <h2>Doctors</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input
        type="text"
        placeholder="Filter by specialization"
        value={specialization}
        onChange={(e) => setSpecialization(e.target.value)}
      />
      <ul>
      {doctors.length === 0 && !error && <p>No doctors found.</p>}
        {doctors.map((doctor) => (
          <li key={doctor._id}>
            <Link to={`/doctor/${doctor.id}`}>
              {doctor.name} - {doctor.specialization}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DoctorList;
