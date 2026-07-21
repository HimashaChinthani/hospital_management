package models

import (
	"time"

	"github.com/himashachinthani/backend/internal/core/domain"
)

type Patient struct {
	ID         uint      `gorm:"primaryKey;column:id"`
	UserID     uint      `gorm:"column:user_id"`
	DOB        time.Time `gorm:"column:dob"`
	Gender     string    `gorm:"column:gender"`
	BloodGroup string    `gorm:"column:blood_group"`
	Address    string    `gorm:"column:address"`
}

// TableName sets table name
func (Patient) TableName() string { return "patients" }

// ToDomain converts DB model to domain
func (p *Patient) ToDomain() *domain.Patient {
	if p == nil {
		return nil
	}
	return &domain.Patient{
		ID:         p.ID,
		UserID:     p.UserID,
		DOB:        p.DOB,
		Gender:     p.Gender,
		BloodGroup: p.BloodGroup,
		Address:    p.Address,
	}
}

// PatientFromDomain converts domain model to DB model
func PatientFromDomain(d *domain.Patient) *Patient {
	if d == nil {
		return nil
	}
	return &Patient{
		ID:         d.ID,
		UserID:     d.UserID,
		DOB:        d.DOB,
		Gender:     d.Gender,
		BloodGroup: d.BloodGroup,
		Address:    d.Address,
	}
}
