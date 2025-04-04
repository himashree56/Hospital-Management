import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../config';

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [specialization, setSpecialization] = useState('');

  useEffect(() => {
    const url = specialization
      ? `${API_BASE_URL}/api/doctors?specialization=${specialization}`
      : `${API_BASE_URL}/api/doctors`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => setDoctors(data))
      .catch((err) => console.error('Error fetching doctors:', err));
  }, [specialization]);

  return (
    <div className="doctor-list-container">
      <h2>Doctors</h2>
      <input
        type="text"
        placeholder="Filter by specialization"
        value={specialization}
        onChange={(e) => setSpecialization(e.target.value)}
      />
      <ul>
        {doctors.map((doctor) => (
          <li key={doctor.id}>
            <a href={`/doctor/${doctor.id}`}>
              {doctor.name} - {doctor.specialization}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DoctorList;
