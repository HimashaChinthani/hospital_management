package models

import (
	"github.com/himashachinthani/backend/internal/core/domain"
)

type Medicine struct {
	ID            uint    `gorm:"primaryKey;column:id"`
	MedicineName  string  `gorm:"column:medicine_name"`
	Description   string  `gorm:"column:description"`
	UnitPrice     float64 `gorm:"column:unit_price"`
	StockQuantity int     `gorm:"column:stock_quantity"`
}

// TableName sets table name
func (Medicine) TableName() string { return "medicines" }

// ToDomain converts DB model to domain
func (m *Medicine) ToDomain() *domain.Medicine {
	if m == nil {
		return nil
	}
	return &domain.Medicine{
		ID:            m.ID,
		MedicineName:  m.MedicineName,
		Description:   m.Description,
		UnitPrice:     m.UnitPrice,
		StockQuantity: m.StockQuantity,
	}
}

// MedicineFromDomain converts domain model to DB model
func MedicineFromDomain(d *domain.Medicine) *Medicine {
	if d == nil {
		return nil
	}
	return &Medicine{
		ID:            d.ID,
		MedicineName:  d.MedicineName,
		Description:   d.Description,
		UnitPrice:     d.UnitPrice,
		StockQuantity: d.StockQuantity,
	}
}
