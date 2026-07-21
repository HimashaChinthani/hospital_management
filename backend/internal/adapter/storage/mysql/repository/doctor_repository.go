package repository

import (
	"context"
	"errors"
	"fmt"

	"github.com/himashachinthani/backend/internal/core/domain"
	"gorm.io/gorm"
)

type DoctorRepository struct {
	db *gorm.DB
}

func NewDoctorRepository(db *gorm.DB) *DoctorRepository {
	return &DoctorRepository{db: db}
}

func (r *DoctorRepository) Create(ctx context.Context, entity *domain.Doctor) error {
	err := r.db.WithContext(ctx).Create(entity).Error
	if err != nil {
		return fmt.Errorf("failed to create doctor: %w", err)
	}
	return nil
}

func (r *DoctorRepository) GetByID(ctx context.Context, id uint) (*domain.Doctor, error) {
	var entity domain.Doctor
	err := r.db.WithContext(ctx).First(&entity, id).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("doctor not found with ID %d: %w", id, err)
		}
		return nil, fmt.Errorf("failed to get doctor by ID %d: %w", id, err)
	}
	return &entity, nil
}

func (r *DoctorRepository) List(ctx context.Context) ([]domain.Doctor, error) {
	var entities []domain.Doctor
	err := r.db.WithContext(ctx).Find(&entities).Error
	if err != nil {
		return nil, fmt.Errorf("failed to list doctors: %w", err)
	}
	return entities, nil
}

func (r *DoctorRepository) Update(ctx context.Context, entity *domain.Doctor) error {
	err := r.db.WithContext(ctx).Save(entity).Error
	if err != nil {
		return fmt.Errorf("failed to update doctor: %w", err)
	}
	return nil
}

func (r *DoctorRepository) Delete(ctx context.Context, id uint) error {
	err := r.db.WithContext(ctx).Delete(&domain.Doctor{}, id).Error
	if err != nil {
		return fmt.Errorf("failed to delete doctor with ID %d: %w", id, err)
	}
	return nil
}
