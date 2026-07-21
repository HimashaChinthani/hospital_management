package repository

import (
	"context"
	"errors"
	"fmt"

	"github.com/himashachinthani/backend/internal/core/domain"
	"gorm.io/gorm"
)

type AppointmentRepository struct {
	db *gorm.DB
}

func NewAppointmentRepository(db *gorm.DB) *AppointmentRepository {
	return &AppointmentRepository{db: db}
}

func (r *AppointmentRepository) Create(ctx context.Context, entity *domain.Appointment) error {
	err := r.db.WithContext(ctx).Create(entity).Error
	if err != nil {
		return fmt.Errorf("failed to create appointment: %w", err)
	}
	return nil
}

func (r *AppointmentRepository) GetByID(ctx context.Context, id uint) (*domain.Appointment, error) {
	var entity domain.Appointment
	err := r.db.WithContext(ctx).First(&entity, id).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("appointment not found with ID %d: %w", id, err)
		}
		return nil, fmt.Errorf("failed to get appointment by ID %d: %w", id, err)
	}
	return &entity, nil
}

func (r *AppointmentRepository) List(ctx context.Context) ([]domain.Appointment, error) {
	var entities []domain.Appointment
	err := r.db.WithContext(ctx).Find(&entities).Error
	if err != nil {
		return nil, fmt.Errorf("failed to list appointments: %w", err)
	}
	return entities, nil
}

func (r *AppointmentRepository) Update(ctx context.Context, entity *domain.Appointment) error {
	err := r.db.WithContext(ctx).Save(entity).Error
	if err != nil {
		return fmt.Errorf("failed to update appointment: %w", err)
	}
	return nil
}

func (r *AppointmentRepository) Delete(ctx context.Context, id uint) error {
	err := r.db.WithContext(ctx).Delete(&domain.Appointment{}, id).Error
	if err != nil {
		return fmt.Errorf("failed to delete appointment with ID %d: %w", id, err)
	}
	return nil
}
