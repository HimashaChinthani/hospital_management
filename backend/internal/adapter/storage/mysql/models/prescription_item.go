package models

import (
	"github.com/himashachinthani/backend/internal/core/domain"
)

type PrescriptionItem struct {
	ID             uint   `gorm:"primaryKey;column:id"`
	PrescriptionID uint   `gorm:"column:prescription_id"`
	MedicineID     uint   `gorm:"column:medicine_id"`
	Dosage         string `gorm:"column:dosage"`
	Duration       string `gorm:"column:duration"`
}

// TableName sets table name
func (PrescriptionItem) TableName() string { return "prescription_items" }

// ToDomain converts DB model to domain
func (p *PrescriptionItem) ToDomain() *domain.PrescriptionItem {
	if p == nil {
		return nil
	}
	return &domain.PrescriptionItem{
		ID:             p.ID,
		PrescriptionID: p.PrescriptionID,
		MedicineID:     p.MedicineID,
		Dosage:         p.Dosage,
		Duration:       p.Duration,
	}
}

// PrescriptionItemFromDomain converts domain model to DB model
func PrescriptionItemFromDomain(d *domain.PrescriptionItem) *PrescriptionItem {
	if d == nil {
		return nil
	}
	return &PrescriptionItem{
		ID:             d.ID,
		PrescriptionID: d.PrescriptionID,
		MedicineID:     d.MedicineID,
		Dosage:         d.Dosage,
		Duration:       d.Duration,
	}
}
