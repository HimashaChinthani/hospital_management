package models

import (
	"time"

	"github.com/himashachinthani/backend/internal/core/domain"
)

type Prescription struct {
	ID            uint      `gorm:"primaryKey;column:id"`
	AppointmentID uint      `gorm:"column:appointment_id"`
	DoctorNotes   string    `gorm:"column:doctor_notes"`
	CreatedAt     time.Time `gorm:"column:created_at"`
}

// TableName sets table name
func (Prescription) TableName() string { return "prescriptions" }

// ToDomain converts DB model to domain
func (p *Prescription) ToDomain() *domain.Prescription {
	if p == nil {
		return nil
	}
	return &domain.Prescription{
		ID:            p.ID,
		AppointmentID: p.AppointmentID,
		DoctorNotes:   p.DoctorNotes,
		CreatedAt:     p.CreatedAt,
	}
}

// PrescriptionFromDomain converts domain model to DB model
func PrescriptionFromDomain(d *domain.Prescription) *Prescription {
	if d == nil {
		return nil
	}
	return &Prescription{
		ID:            d.ID,
		AppointmentID: d.AppointmentID,
		DoctorNotes:   d.DoctorNotes,
		CreatedAt:     d.CreatedAt,
	}
}
