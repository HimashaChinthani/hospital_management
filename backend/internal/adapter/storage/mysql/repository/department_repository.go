package repository

import (
	"context"
	"errors"
	"fmt"

	"github.com/himashachinthani/backend/internal/core/domain"
	"gorm.io/gorm"
)

type DepartmentRepository struct {
	db *gorm.DB
}

func NewDepartmentRepository(db *gorm.DB) *DepartmentRepository {
	return &DepartmentRepository{db: db}
}

func (r *DepartmentRepository) Create(ctx context.Context, entity *domain.Department) error {
	err := r.db.WithContext(ctx).Create(entity).Error
	if err != nil {
		return fmt.Errorf("failed to create department: %w", err)
	}
	return nil
}

func (r *DepartmentRepository) GetByID(ctx context.Context, id uint) (*domain.Department, error) {
	var entity domain.Department
	err := r.db.WithContext(ctx).First(&entity, id).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("department not found with ID %d: %w", id, err)
		}
		return nil, fmt.Errorf("failed to get department by ID %d: %w", id, err)
	}
	return &entity, nil
}

func (r *DepartmentRepository) List(ctx context.Context) ([]domain.Department, error) {
	var entities []domain.Department
	err := r.db.WithContext(ctx).Find(&entities).Error
	if err != nil {
		return nil, fmt.Errorf("failed to list departments: %w", err)
	}
	return entities, nil
}

func (r *DepartmentRepository) Update(ctx context.Context, entity *domain.Department) error {
	err := r.db.WithContext(ctx).Save(entity).Error
	if err != nil {
		return fmt.Errorf("failed to update department: %w", err)
	}
	return nil
}

func (r *DepartmentRepository) Delete(ctx context.Context, id uint) error {
	err := r.db.WithContext(ctx).Delete(&domain.Department{}, id).Error
	if err != nil {
		return fmt.Errorf("failed to delete department with ID %d: %w", id, err)
	}
	return nil
}
