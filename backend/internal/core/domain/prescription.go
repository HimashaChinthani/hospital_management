package domain

import "time"

type Prescription struct {
	ID            uint
	AppointmentID uint
	DoctorNotes   string
	CreatedAt     time.Time
}
