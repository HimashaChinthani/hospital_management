package models

import (
	"github.com/himashachinthani/backend/internal/core/domain"
)

type Doctor struct {
	ID              uint   `gorm:"primaryKey;column:id"`
	UserID          uint   `gorm:"column:user_id"`
	DepartmentID    uint   `gorm:"column:department_id"`
	Specialization  string `gorm:"column:specialization"`
	ExperienceYears int    `gorm:"column:experience_years"`
}

// TableName sets table name
func (Doctor) TableName() string { return "doctors" }

// ToDomain converts DB model to domain
func (d *Doctor) ToDomain() *domain.Doctor {
	if d == nil {
		return nil
	}
	return &domain.Doctor{
		ID:              d.ID,
		UserID:          d.UserID,
		DepartmentID:    d.DepartmentID,
		Specialization:  d.Specialization,
		ExperienceYears: d.ExperienceYears,
	}
}

// DoctorFromDomain converts domain model to DB model
func DoctorFromDomain(d *domain.Doctor) *Doctor {
	if d == nil {
		return nil
	}
	return &Doctor{
		ID:              d.ID,
		UserID:          d.UserID,
		DepartmentID:    d.DepartmentID,
		Specialization:  d.Specialization,
		ExperienceYears: d.ExperienceYears,
	}
}
