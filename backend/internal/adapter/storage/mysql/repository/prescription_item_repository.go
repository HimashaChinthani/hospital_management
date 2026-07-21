package repository

import (
	"context"
	"errors"
	"fmt"

	"github.com/himashachinthani/backend/internal/core/domain"
	"gorm.io/gorm"
)

type PrescriptionItemRepository struct {
	db *gorm.DB
}

func NewPrescriptionItemRepository(db *gorm.DB) *PrescriptionItemRepository {
	return &PrescriptionItemRepository{db: db}
}

func (r *PrescriptionItemRepository) Create(ctx context.Context, entity *domain.PrescriptionItem) error {
	err := r.db.WithContext(ctx).Create(entity).Error
	if err != nil {
		return fmt.Errorf("failed to create prescription item: %w", err)
	}
	return nil
}

func (r *PrescriptionItemRepository) GetByID(ctx context.Context, id uint) (*domain.PrescriptionItem, error) {
	var entity domain.PrescriptionItem
	err := r.db.WithContext(ctx).First(&entity, id).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("prescription item not found with ID %d: %w", id, err)
		}
		return nil, fmt.Errorf("failed to get prescription item by ID %d: %w", id, err)
	}
	return &entity, nil
}

func (r *PrescriptionItemRepository) List(ctx context.Context) ([]domain.PrescriptionItem, error) {
	var entities []domain.PrescriptionItem
	err := r.db.WithContext(ctx).Find(&entities).Error
	if err != nil {
		return nil, fmt.Errorf("failed to list prescription items: %w", err)
	}
	return entities, nil
}

func (r *PrescriptionItemRepository) Update(ctx context.Context, entity *domain.PrescriptionItem) error {
	err := r.db.WithContext(ctx).Save(entity).Error
	if err != nil {
		return fmt.Errorf("failed to update prescription item: %w", err)
	}
	return nil
}

func (r *PrescriptionItemRepository) Delete(ctx context.Context, id uint) error {
	err := r.db.WithContext(ctx).Delete(&domain.PrescriptionItem{}, id).Error
	if err != nil {
		return fmt.Errorf("failed to delete prescription item with ID %d: %w", id, err)
	}
	return nil
}
