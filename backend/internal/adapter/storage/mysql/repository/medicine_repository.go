package repository

import (
	"context"
	"errors"
	"fmt"

	"github.com/himashachinthani/backend/internal/core/domain"
	"gorm.io/gorm"
)

type MedicineRepository struct {
	db *gorm.DB
}

func NewMedicineRepository(db *gorm.DB) *MedicineRepository {
	return &MedicineRepository{db: db}
}

func (r *MedicineRepository) Create(ctx context.Context, entity *domain.Medicine) error {
	err := r.db.WithContext(ctx).Create(entity).Error
	if err != nil {
		return fmt.Errorf("failed to create medicine: %w", err)
	}
	return nil
}

func (r *MedicineRepository) GetByID(ctx context.Context, id uint) (*domain.Medicine, error) {
	var entity domain.Medicine
	err := r.db.WithContext(ctx).First(&entity, id).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("medicine not found with ID %d: %w", id, err)
		}
		return nil, fmt.Errorf("failed to get medicine by ID %d: %w", id, err)
	}
	return &entity, nil
}

func (r *MedicineRepository) List(ctx context.Context) ([]domain.Medicine, error) {
	var entities []domain.Medicine
	err := r.db.WithContext(ctx).Find(&entities).Error
	if err != nil {
		return nil, fmt.Errorf("failed to list medicines: %w", err)
	}
	return entities, nil
}

func (r *MedicineRepository) Update(ctx context.Context, entity *domain.Medicine) error {
	err := r.db.WithContext(ctx).Save(entity).Error
	if err != nil {
		return fmt.Errorf("failed to update medicine: %w", err)
	}
	return nil
}

func (r *MedicineRepository) Delete(ctx context.Context, id uint) error {
	err := r.db.WithContext(ctx).Delete(&domain.Medicine{}, id).Error
	if err != nil {
		return fmt.Errorf("failed to delete medicine with ID %d: %w", id, err)
	}
	return nil
}
