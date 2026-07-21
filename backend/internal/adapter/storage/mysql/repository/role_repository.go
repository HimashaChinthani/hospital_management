package repository

import (
	"context"
	"errors"
	"fmt"

	"github.com/himashachinthani/backend/internal/core/domain"
	"gorm.io/gorm"
)

type RoleRepository struct {
	db *gorm.DB
}

func NewRoleRepository(db *gorm.DB) *RoleRepository {
	return &RoleRepository{db: db}
}

func (r *RoleRepository) Create(ctx context.Context, role *domain.Role) error {
	err := r.db.WithContext(ctx).Create(role).Error
	if err != nil {
		return fmt.Errorf("failed to create role: %w", err)
	}
	return nil
}

func (r *RoleRepository) GetByID(ctx context.Context, id uint) (*domain.Role, error) {
	var role domain.Role
	err := r.db.WithContext(ctx).First(&role, id).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("role not found with ID %d: %w", id, err)
		}
		return nil, fmt.Errorf("failed to get role by ID %d: %w", id, err)
	}
	return &role, nil
}

func (r *RoleRepository) GetByName(ctx context.Context, name string) (*domain.Role, error) {
	var role domain.Role
	err := r.db.WithContext(ctx).Where("name = ?", name).First(&role).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("role not found with name %s: %w", name, err)
		}
		return nil, fmt.Errorf("failed to get role by name %s: %w", name, err)
	}
	return &role, nil
}

func (r *RoleRepository) List(ctx context.Context) ([]domain.Role, error) {
	var roles []domain.Role
	err := r.db.WithContext(ctx).Find(&roles).Error
	if err != nil {
		return nil, fmt.Errorf("failed to list roles: %w", err)
	}
	return roles, nil
}

func (r *RoleRepository) Update(ctx context.Context, role *domain.Role) error {
	err := r.db.WithContext(ctx).Save(role).Error
	if err != nil {
		return fmt.Errorf("failed to update role with ID %d: %w", role.ID, err)
	}
	return nil
}

func (r *RoleRepository) Delete(ctx context.Context, id uint) error {
	err := r.db.WithContext(ctx).Delete(&domain.Role{}, id).Error
	if err != nil {
		return fmt.Errorf("failed to delete role with ID %d: %w", id, err)
	}
	return nil
}
