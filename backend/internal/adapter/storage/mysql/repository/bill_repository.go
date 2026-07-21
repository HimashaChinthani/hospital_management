package repository

import (
	"context"
	"errors"
	"fmt"

	"github.com/himashachinthani/backend/internal/core/domain"
	"gorm.io/gorm"
)

type BillRepository struct {
	db *gorm.DB
}

func NewBillRepository(db *gorm.DB) *BillRepository {
	return &BillRepository{db: db}
}

func (r *BillRepository) Create(ctx context.Context, entity *domain.Bill) error {
	err := r.db.WithContext(ctx).Create(entity).Error
	if err != nil {
		return fmt.Errorf("failed to create bill: %w", err)
	}
	return nil
}

func (r *BillRepository) GetByID(ctx context.Context, id uint) (*domain.Bill, error) {
	var entity domain.Bill
	err := r.db.WithContext(ctx).First(&entity, id).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("bill not found with ID %d: %w", id, err)
		}
		return nil, fmt.Errorf("failed to get bill by ID %d: %w", id, err)
	}
	return &entity, nil
}

func (r *BillRepository) List(ctx context.Context) ([]domain.Bill, error) {
	var entities []domain.Bill
	err := r.db.WithContext(ctx).Find(&entities).Error
	if err != nil {
		return nil, fmt.Errorf("failed to list bills: %w", err)
	}
	return entities, nil
}

func (r *BillRepository) Update(ctx context.Context, entity *domain.Bill) error {
	err := r.db.WithContext(ctx).Save(entity).Error
	if err != nil {
		return fmt.Errorf("failed to update bill: %w", err)
	}
	return nil
}

func (r *BillRepository) Delete(ctx context.Context, id uint) error {
	err := r.db.WithContext(ctx).Delete(&domain.Bill{}, id).Error
	if err != nil {
		return fmt.Errorf("failed to delete bill with ID %d: %w", id, err)
	}
	return nil
}
