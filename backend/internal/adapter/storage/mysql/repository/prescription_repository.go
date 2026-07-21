package repository

import (
	"context"
	"errors"
	"fmt"

	"github.com/himashachinthani/backend/internal/core/domain"
	"gorm.io/gorm"
)

type PrescriptionRepository struct {
	db *gorm.DB
}

func NewPrescriptionRepository(db *gorm.DB) *PrescriptionRepository {
	return &PrescriptionRepository{db: db}
}

func (r *PrescriptionRepository) Create(ctx context.Context, entity *domain.Prescription) error {
	err := r.db.WithContext(ctx).Create(entity).Error
	if err != nil {
		return fmt.Errorf("failed to create prescription: %w", err)
	}
	return nil
}

func (r *PrescriptionRepository) GetByID(ctx context.Context, id uint) (*domain.Prescription, error) {
	var entity domain.Prescription
	err := r.db.WithContext(ctx).First(&entity, id).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("prescription not found with ID %d: %w", id, err)
		}
		return nil, fmt.Errorf("failed to get prescription by ID %d: %w", id, err)
	}
	return &entity, nil
}

func (r *PrescriptionRepository) List(ctx context.Context) ([]domain.Prescription, error) {
	var entities []domain.Prescription
	err := r.db.WithContext(ctx).Find(&entities).Error
	if err != nil {
		return nil, fmt.Errorf("failed to list prescriptions: %w", err)
	}
	return entities, nil
}

func (r *PrescriptionRepository) Update(ctx context.Context, entity *domain.Prescription) error {
	err := r.db.WithContext(ctx).Save(entity).Error
	if err != nil {
		return fmt.Errorf("failed to update prescription: %w", err)
	}
	return nil
}

func (r *PrescriptionRepository) Delete(ctx context.Context, id uint) error {
	err := r.db.WithContext(ctx).Delete(&domain.Prescription{}, id).Error
	if err != nil {
		return fmt.Errorf("failed to delete prescription with ID %d: %w", id, err)
	}
	return nil
}
