package models

import (
	"github.com/himashachinthani/backend/internal/core/domain"
)

type Department struct {
	ID             uint   `gorm:"primaryKey;column:id"`
	DepartmentName string `gorm:"column:department_name"`
}

// TableName sets table name
func (Department) TableName() string { return "departments" }

// ToDomain converts DB model to domain
func (d *Department) ToDomain() *domain.Department {
	if d == nil {
		return nil
	}
	return &domain.Department{
		ID:             d.ID,
		DepartmentName: d.DepartmentName,
	}
}

// DepartmentFromDomain converts domain model to DB model
func DepartmentFromDomain(d *domain.Department) *Department {
	if d == nil {
		return nil
	}
	return &Department{
		ID:             d.ID,
		DepartmentName: d.DepartmentName,
	}
}
