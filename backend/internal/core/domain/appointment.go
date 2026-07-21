package domain

import "time"

type Appointment struct {
	ID              uint
	PatientID       uint
	DoctorID        uint
	AppointmentDate time.Time
	AppointmentTime string
	Status          string
}
