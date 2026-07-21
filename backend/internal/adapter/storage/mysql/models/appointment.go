package models

import (
	"time"

	"github.com/himashachinthani/backend/internal/core/domain"
)

type Appointment struct {
	ID              uint      `gorm:"primaryKey;column:id"`
	PatientID       uint      `gorm:"column:patient_id"`
	DoctorID        uint      `gorm:"column:doctor_id"`
	AppointmentDate time.Time `gorm:"column:appointment_date"`
	AppointmentTime string    `gorm:"column:appointment_time"`
	Status          string    `gorm:"column:status"`
}

// TableName sets table name
func (Appointment) TableName() string { return "appointments" }

// ToDomain converts DB model to domain
func (a *Appointment) ToDomain() *domain.Appointment {
	if a == nil {
		return nil
	}
	return &domain.Appointment{
		ID:              a.ID,
		PatientID:       a.PatientID,
		DoctorID:        a.DoctorID,
		AppointmentDate: a.AppointmentDate,
		AppointmentTime: a.AppointmentTime,
		Status:          a.Status,
	}
}

// AppointmentFromDomain converts domain model to DB model
func AppointmentFromDomain(d *domain.Appointment) *Appointment {
	if d == nil {
		return nil
	}
	return &Appointment{
		ID:              d.ID,
		PatientID:       d.PatientID,
		DoctorID:        d.DoctorID,
		AppointmentDate: d.AppointmentDate,
		AppointmentTime: d.AppointmentTime,
		Status:          d.Status,
	}
}
