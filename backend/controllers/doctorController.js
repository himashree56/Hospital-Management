import Doctor from '../models/Doctor.js';
import Appointment from '../models/Appointment.js';

export const getDoctors = async (req, res) => {
  try {
    const { specialization } = req.query;
    const query = { approved: true };
    if (specialization) {
      query.specialization = { $regex: specialization, $options: 'i' };
    }
    const doctors = await Doctor.find(query);
    res.json(doctors);
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor || !doctor.approved) {
      return res.status(404).json({ error: 'Doctor not found or not approved' });
    }
    res.json(doctor);
  } catch (error) {
    console.error('Error fetching doctor by ID:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getDoctorByName = async (req, res) => {
  try {
    const doctor = await Doctor.findOne(
      { name: { $regex: new RegExp(`^${req.params.name}$`, 'i') }, approved: true }
    );
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found or not approved' });
    }
    res.json(doctor);
  } catch (error) {
    console.error('Error fetching doctor:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getDoctorAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctorId: req.user.id });
    res.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const addDoctorAppointment = async (req, res) => {
  const { patientName, date, timeSlot } = req.body;
  const doctorId = req.user.id;

  if (!patientName || !date || !timeSlot) {
    return res.status(400).json({ message: 'Patient name, date, and time slot are required' });
  }

  try {
    const newAppointment = new Appointment({ patientName, date, timeSlot, doctorId });
    await newAppointment.save();
    res.status(201).json(newAppointment);
  } catch (error) {
    console.error('Error adding appointment:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const addTimeSlot = async (req, res) => {
  if (req.user.role !== 'doctor') {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  const { date, slots } = req.body;
  const doctorId = req.user.id;

  if (!date || !slots || !Array.isArray(slots) || slots.length === 0) {
    return res.status(400).json({ error: 'Date and at least one time slot are required' });
  }

  try {
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    for (const slot of slots) {
      const existingSlot = doctor.timeSlots.find(
        (s) => s.date === date && s.slot === slot
      );
      if (!existingSlot) {
        doctor.timeSlots.push({ date, slot });
      }
    }

    await doctor.save();
    res.status(201).json({ message: 'Time slots added successfully' });
  } catch (error) {
    console.error('Error adding time slots:', error);
    res.status(500).json({ error: 'Server error' });
  }
};