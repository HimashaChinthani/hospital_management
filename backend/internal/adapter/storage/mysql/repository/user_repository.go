package repository

import (
	"context"
	"errors"
	"fmt"

	"github.com/himashachinthani/backend/internal/core/domain"
	"gorm.io/gorm"
)

type UserRepository struct {
	db *gorm.DB
}

func NewUserRepository(db *gorm.DB) *UserRepository {
	return &UserRepository{db: db}
}

func (r *UserRepository) Create(ctx context.Context, user *domain.User) error {
	err := r.db.WithContext(ctx).Create(user).Error
	if err != nil {
		return fmt.Errorf("failed to create user: %w", err)
	}
	return nil
}

func (r *UserRepository) GetByID(ctx context.Context, id uint) (*domain.User, error) {
	var user domain.User
	err := r.db.WithContext(ctx).First(&user, id).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("user not found with ID %d: %w", id, err)
		}
		return nil, fmt.Errorf("failed to get user by ID %d: %w", id, err)
	}
	return &user, nil
}

func (r *UserRepository) GetByEmail(ctx context.Context, email string) (*domain.User, error) {
	var user domain.User
	err := r.db.WithContext(ctx).Where("email = ?", email).First(&user).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("user not found with email %s: %w", email, err)
		}
		return nil, fmt.Errorf("failed to get user by email %s: %w", email, err)
	}
	return &user, nil
}

func (r *UserRepository) Update(ctx context.Context, user *domain.User) error {
	err := r.db.WithContext(ctx).Save(user).Error
	if err != nil {
		return fmt.Errorf("failed to update user with ID %d: %w", user.ID, err)
	}
	return nil
}

func (r *UserRepository) Delete(ctx context.Context, id uint) error {
	err := r.db.WithContext(ctx).Delete(&domain.User{}, id).Error
	if err != nil {
		return fmt.Errorf("failed to delete user with ID %d: %w", id, err)
	}
	return nil
}
