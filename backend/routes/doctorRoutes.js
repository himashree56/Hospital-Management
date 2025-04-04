import express from 'express';
import { getDoctors, getDoctorById , getDoctorById, getDoctorByName, getDoctorAppointments, addDoctorAppointment, addTimeSlot } from '../controllers/doctorController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getDoctors); 
router.get('/id/:id', protect, getDoctorById);
router.get('/:name', protect, getDoctorByName);
router.route('/appointments')
  .get(protect, getDoctorAppointments)
  .post(protect, addDoctorAppointment);
router.post('/add-time-slot', protect, addTimeSlot);

export default router;