package repository

import (
	"context"
	"errors"
	"fmt"

	"github.com/himashachinthani/backend/internal/core/domain"
	"gorm.io/gorm"
)

type PaymentRepository struct {
	db *gorm.DB
}

func NewPaymentRepository(db *gorm.DB) *PaymentRepository {
	return &PaymentRepository{db: db}
}

func (r *PaymentRepository) Create(ctx context.Context, entity *domain.Payment) error {
	err := r.db.WithContext(ctx).Create(entity).Error
	if err != nil {
		return fmt.Errorf("failed to create payment: %w", err)
	}
	return nil
}

func (r *PaymentRepository) GetByID(ctx context.Context, id uint) (*domain.Payment, error) {
	var entity domain.Payment
	err := r.db.WithContext(ctx).First(&entity, id).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("payment not found with ID %d: %w", id, err)
		}
		return nil, fmt.Errorf("failed to get payment by ID %d: %w", id, err)
	}
	return &entity, nil
}

func (r *PaymentRepository) List(ctx context.Context) ([]domain.Payment, error) {
	var entities []domain.Payment
	err := r.db.WithContext(ctx).Find(&entities).Error
	if err != nil {
		return nil, fmt.Errorf("failed to list payments: %w", err)
	}
	return entities, nil
}

func (r *PaymentRepository) Update(ctx context.Context, entity *domain.Payment) error {
	err := r.db.WithContext(ctx).Save(entity).Error
	if err != nil {
		return fmt.Errorf("failed to update payment: %w", err)
	}
	return nil
}

func (r *PaymentRepository) Delete(ctx context.Context, id uint) error {
	err := r.db.WithContext(ctx).Delete(&domain.Payment{}, id).Error
	if err != nil {
		return fmt.Errorf("failed to delete payment with ID %d: %w", id, err)
	}
	return nil
}
